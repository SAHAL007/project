// db.js
const mysql = require('mysql2');

// Create connection to MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'Admin',      // Your MySQL username
    password: 'Admin@12345',      // Your MySQL password
    database: 'auth_system'
});

// Connect to the database
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

module.exports = connection;
