const elasticsearch = require('elasticsearch');

const elasticClient = new elasticsearch.Client({
    host: 'localhost:9200'
});

const searchProducts = async (req, res) => {
    const { query, page, limit } = req.query; // Get search query, page, and limit parameters from request
    // console.log('Inside search', query);

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is missing' });
    }

    try {
        let sort = 'lte';
        let value = 10000000;
        let data = query.toLowerCase();

        const downKeywords = ['under', 'below', 'less', 'within', 'down', 'lesser', 'in'];
        const upKeywords = ['over', 'above', 'greater', 'up', 'higher'];
        const equalKeywords = ['equal', 'same', 'exactly', 'equivalent'];

        const extraKeywords = [',', '/', ':', '\\[', '\\]', ' rs','rs\\.', 'amt', 'amt\\.', '\\+', '\\-', 'than', ' to ', ' to', 'as','price'];

        function escapeRegExp(string) {
            const pattern = extraKeywords.map(keyword => `\\b${keyword}\\b`).join('|');
            const regex = new RegExp(pattern, 'gi');
            return string.replace(regex, ' ');
        }


        extraKeywords.forEach((val) => {
            const escapedVal = escapeRegExp(val);
            data = data.replace(new RegExp(escapedVal, 'g'), ' ');
            // console.log("--->",data);
        });

        downKeywords.forEach((val) => {
            if (data.includes(val)) {
                sort = 'lte';
                data = data.replace(new RegExp(val, 'g'), '').trim();
            }
        });

        upKeywords.forEach((val) => {
            if (data.includes(val)) {
                sort = 'gte';
                data = data.replace(new RegExp(val, 'g'), ' ').trim();
            }
        });

        equalKeywords.forEach((val) => {
            if (data.includes(val)) {
                sort = 'eq';
                data = data.replace(new RegExp(val, 'g'), ' ').trim();
            }
        });

        data = data.replace(/\s+/g, ' ').trim();
        const parts = data.split(' ');
        // // console.log(typeof(parts))
        // console.log("parts :"+parts, "length "+parts.length) ;
        // console.log(parts[0],parts[1],parts[2],parts[3]);
        // Check if the last part of the query is a number
        // if (parts.length > 1 && !isNaN(parseFloat(parts[parts.length - 1]))) {
        //     value = parseFloat(parts[parts.length - 1]);
        //     data = parts.slice(0, -1).join(' ').trim();
        // } else if (parts.length === 1) {
        //     // Handle single word query
        //     // data = parts[0].trim(); // Directly use the single word
        //     if (isNaN(parseFloat(parts[parts.length - 1]))) {
        //         data = parts[0].trim();
        //     } else {
        //         // console.log("this" ,(isNaN(parseFloat(parts[parts.length - 1]))));
        //         value = parseFloat(parts[parts.length - 1]);
        //         sort = 'lte';
        //         data = '';
        //         // console.log(value);
        //     }
        // }

        if (parts.length > 1) {
            let foundNumber = false;
            let numericValue = NaN;
        
            // Iterate through parts to find the numeric value
            for (let i = 0; i < parts.length; i++) {
                if (!isNaN(parseFloat(parts[i]))) {
                    numericValue = parseFloat(parts[i]);
                    foundNumber = true;
                    break;  // Exit loop once a number is found
                }
            }
        
            if (foundNumber) {
                value = numericValue;
                // Join parts excluding the numeric value to form the data string
                data = parts.filter((part, index) => index !== parts.indexOf(numericValue.toString())).join(' ').trim();
            } else {
                // No numeric value found, use the last part as the default behavior
                // value = parseFloat(parts[parts.length - 1]);
                data = parts.join(' ').trim();
            }
        } else if (parts.length === 1) {
            if (isNaN(parseFloat(parts[0]))) {
                data = parts[0].trim();
            } else {
                value = parseFloat(parts[0]);
                sort = 'lte';
                data = '';
            }
        }
        
        

        const from = (page - 1) * limit;
        let priceQuery;

        if (sort === 'eq') {
            priceQuery = { term: { price: value } };
        } else if (sort) {
            priceQuery = { range: { price: { [sort]: value } } };
        } else {
            priceQuery = { exists: { field: 'price' } };
        }
        console.log(data);

        let mustQueries = [];
        let shouldQueries = [];

        if (!isNaN(value) && data.trim() === '') {
            // Only numeric value provided, search for products with prices less than the input value
            mustQueries = [
                { range: { price: { lte: value } } }
            ];
        } else {
            // Normal search with price conditions and data
            mustQueries = [priceQuery];
            shouldQueries = [
                {
                    multi_match: {
                        query: data,
                        fields: ['product_name', 'category_name'],
                        fuzziness: 'AUTO'
                    }
                }
            ];
        }

        const result = await elasticClient.search({
            index: 'products_index',
            body: {
                from,
                size: limit,
                query: {
                    bool: {
                        must: mustQueries,
                        should: shouldQueries,
                        minimum_should_match: shouldQueries.length > 0 ? 1 : 0
                    }
                },
                _source: ['product_id', 'product_name', 'price', 'discounted_price', 'updated_date', 'category_name']
            }
        });


        const total = result.hits.total.value;
        const hits = result.hits.hits.map((hit) => hit._source);

        console.log(hits);
        res.json({
            hits,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }); // Send search results as JSON response
    } catch (error) {
        console.error('Error searching with Elasticsearch:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    searchProducts
};
