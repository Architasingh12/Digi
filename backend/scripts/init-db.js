const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initDB() {
    console.log('--- Digi-Ready Database Initialization ---');

    const connectionConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    };

    let connection;

    try {
        console.log(`Connecting to MySQL at ${connectionConfig.host}...`);
        connection = await mysql.createConnection(connectionConfig);

        const dbName = process.env.DB_NAME || 'digi_ready';
        console.log(`Creating database "${dbName}" if it doesn't exist...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        await connection.query(`USE ${dbName}`);

        console.log('Reading schema.sql...');
        const schemaPath = path.join(__dirname, '../../database/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema queries...');
        await connection.query(schemaSql);

        console.log('✅ Database and tables created successfully!');
    } catch (error) {
        console.error('❌ Error during database initialization:');
        console.error(error.message);
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Hint: Check your DB_USER and DB_PASSWORD in backend/.env');
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('Connection closed.');
        }
    }
}

initDB();
