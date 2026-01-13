const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function seedAdmin() {
    const connectionConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'digi_ready'
    };

    let connection;

    try {
        connection = await mysql.createConnection(connectionConfig);

        const email = 'admin@example.com';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if admin already exists
        const [rows] = await connection.execute('SELECT * FROM companies WHERE email = ?', [email]);

        if (rows.length > 0) {
            console.log('Admin already exists. Updating password...');
            await connection.execute('UPDATE companies SET password = ? WHERE email = ?', [hashedPassword, email]);
            console.log('Password updated to: admin123');
        } else {
            console.log('Creating new admin...');
            await connection.execute(`
                INSERT INTO companies (firstname, lastname, company_title, email, password, license_qty, created_ip, email_addresses)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, ['System', 'Admin', 'DigiReady Corp', email, hashedPassword, 100, '127.0.0.1', '']);
            console.log('Admin created successfully');
        }

        console.log('-----------------------------------');
        console.log('Login Credentials:');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-----------------------------------');

    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        if (connection) await connection.end();
    }
}

seedAdmin();
