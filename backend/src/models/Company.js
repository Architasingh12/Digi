const db = require('../config/db');

const Company = {
    create: async (data) => {
        const { firstname, lastname, company_title, email, password, license_qty, license_expiry, phone, status, created_ip } = data;
        const email_addresses = ''; // Default empty string for legacy column
        const sql = `INSERT INTO companies 
            (firstname, lastname, company_title, email_addresses, email, password, license_qty, license_expiry, phone, status, created_ip) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        try {
            const [result] = await db.execute(sql, [
                firstname, lastname, company_title, email_addresses, email, password,
                license_qty, license_expiry, phone, status, created_ip
            ]);
            return result.insertId;
        } catch (err) {
            console.error("Database Error in Company.create:", err);
            throw err;
        }
    },

    findAll: async () => {
        const sql = 'SELECT * FROM companies ORDER BY created_at DESC';
        const [rows] = await db.execute(sql);
        return rows;
    },

    findByEmail: async (email) => {
        const sql = 'SELECT * FROM companies WHERE email = ?';
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    },

    findById: async (id) => {
        const sql = 'SELECT * FROM companies WHERE company_id = ?';
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    },

    update: async (id, data) => {
        const { firstname, lastname, company_title, email, license_qty, license_expiry, phone, status } = data;
        const sql = `UPDATE companies SET 
            firstname = ?, lastname = ?, company_title = ?, email = ?, 
            license_qty = ?, license_expiry = ?, phone = ?, status = ?
            WHERE company_id = ?`;

        const [result] = await db.execute(sql, [
            firstname, lastname, company_title, email,
            license_qty, license_expiry, phone, status, id
        ]);
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const sql = 'DELETE FROM companies WHERE company_id = ?';
        const [result] = await db.execute(sql, [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Company;
