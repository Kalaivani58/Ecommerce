const connection = require('./database');

function getCategoryTable(page, limit) {
    const offset = (page - 1) * limit;
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM category_table LIMIT ${limit} OFFSET ${offset}`;
        connection.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getCategoryCount() {
    return new Promise((resolve, reject) => {
        const query = `SELECT COUNT(*) AS total FROM category_table`;
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
    getCategoryTable,
    getCategoryCount
};
