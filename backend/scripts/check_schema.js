const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../backend/.env') });

async function checkSchema() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [rows] = await connection.query("DESCRIBE companies");
        console.log("--- Companies Table Schema ---");
        rows.forEach(row => {
            console.log(`${row.Field}: ${row.Type} (Null: ${row.Null}, Key: ${row.Key}, Default: ${row.Default})`);
        });

    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (connection) await connection.end();
    }
}

checkSchema();
