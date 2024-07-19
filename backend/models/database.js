const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12720544',
  password: 'DGHKb6WKW2',
  database: 'sql12720544',
  port:  3306,
  connectTimeout: 20000 // 10 seconds
});

// Host: sql12.freesqldatabase.com
// Database name: sql12720544
// Database user: sql12720544
// Database password: DGHKb6WKW2
// Port number: 3306



connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL');
});

module.exports = connection;
