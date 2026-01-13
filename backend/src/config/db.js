const mysql = require('mysql2');
const path = require('path');
const result = require('dotenv').config({ path: path.join(__dirname, '../../.env') });

console.log('--- DB Config Debug ---');
console.log('Dotenv Result:', result.error ? result.error : 'Success');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('-----------------------');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
