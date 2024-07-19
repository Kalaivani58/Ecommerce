const connection = require('./database');

function getProductTable(page, limit, category = null) {
    const offset = (page - 1) * limit;
    let query;
    if (category) {
        query = `SELECT * FROM product_table WHERE category_name = '${category}' LIMIT ${limit} OFFSET ${offset}`;
    } else {
        query = `SELECT * FROM product_table LIMIT ${limit} OFFSET ${offset}`;
    }
    return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getProductCount(category = null) {
    let query;
    if (category) {
        query = `SELECT COUNT(*) AS total FROM product_table WHERE category_name = '${category}'`;
    } else {
        query = `SELECT COUNT(*) AS total FROM product_table`;
    }
    return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0].total);
            }
        });
    });
}

module.exports = {
    getProductTable,
    getProductCount
};
