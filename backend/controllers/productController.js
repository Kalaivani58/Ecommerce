const productModel = require('../models/productModel');

async function getProductTable(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const category = req.query.category || null;
    try {
        const results = await productModel.getProductTable(page, limit, category);
        const totalProducts = await productModel.getProductCount(category);
        const totalPages = Math.ceil(totalProducts / limit);
        const responseData = {
            results,
            totalPages,
            currentPage: page
        };
        res.send(responseData);
    } catch (err) {
        console.error('Error fetching product table: ', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getProductTable
};
