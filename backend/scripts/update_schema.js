const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../backend/.env') });

async function updateSchema() {
    let connection;
    try {
        console.log('Connecting to database...');
        console.log('DB Config:', {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME
        });

        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected!');

        const columns = [
            "ADD COLUMN user_id VARCHAR(50)",
            "ADD COLUMN section VARCHAR(100)",
            "ADD COLUMN industry VARCHAR(100)",
            "ADD COLUMN geography VARCHAR(100)",
            "ADD COLUMN company VARCHAR(100)",
            "ADD COLUMN `function` VARCHAR(100)",
            "ADD COLUMN division VARCHAR(100)"
        ];

        for (const col of columns) {
            try {
                await connection.query(`ALTER TABLE participants ${col}`);
                console.log(`Executed: ${col}`);
            } catch (err) {
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log(`Column already exists: ${col}`);
                } else {
                    console.error(`Error executing ${col}:`, err.message);
                }
            }
        }

        console.log('Schema update completed!');

    } catch (err) {
        console.error('Fatal error:', err);
    } finally {
        if (connection) await connection.end();
    }
}

updateSchema();
