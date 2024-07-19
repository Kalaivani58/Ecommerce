const categoryModel = require('../models/categoryModel');

async function getCategoryTable(req, res) {
    const page = req.query.page || 1;
    const limit = 5;
    try {
        const results = await categoryModel.getCategoryTable(page, limit);
        const totalCategories = await categoryModel.getCategoryCount();
        const totalPages = Math.ceil(totalCategories / limit);
        const responseData = {
            results,
            totalPages,
            currentPage: page
        };
        res.send(responseData);
        // console.log(responseData);
    } catch (err) {
        console.error('Error fetching category table: ', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getCategoryTable
};
