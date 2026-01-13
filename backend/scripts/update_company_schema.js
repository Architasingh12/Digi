const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../backend/.env') });

async function updateSchema() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected!');

        const columns = [
            "ADD COLUMN phone VARCHAR(20)",
            "ADD COLUMN status BOOLEAN DEFAULT true"
        ];

        for (const col of columns) {
            try {
                await connection.query(`ALTER TABLE companies ${col}`);
                console.log(`Executed: ${col}`);
            } catch (err) {
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log(`Column already exists: ${col}`);
                } else {
                    console.error(`Error executing ${col}:`, err.message);
                }
            }
        }

        console.log('Company schema update completed!');

    } catch (err) {
        console.error('Fatal error:', err);
    } finally {
        if (connection) await connection.end();
    }
}

updateSchema();
