const db = require('../config/db');

const Participant = {
    create: async (data) => {
        const {
            company_id, firstname, lastname, email, password, designation,
            level, user_id, section, industry, geography, company,
            function_area, division, created_ip
        } = data;

        // Ensure new columns exist in your DB or handle schema migration if needed
        // For now assuming we might need to be flexible or update schema
        // Adding all new fields to query
        const sql = `INSERT INTO participants 
            (company_id, firstname, lastname, email, password, designation, level, user_id, section, industry, geography, company, function, division, created_ip) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await db.execute(sql, [
            company_id, firstname, lastname, email, password, designation,
            level, user_id, section, industry, geography, company,
            function_area, division, created_ip
        ]);
        return result.insertId;
    },

    findByCompanyId: async (companyId) => {
        const sql = 'SELECT * FROM participants WHERE company_id = ? ORDER BY created_at DESC';
        const [rows] = await db.execute(sql, [companyId]);
        return rows;
    },

    findByEmail: async (email) => {
        const sql = 'SELECT * FROM participants WHERE email = ?';
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    },

    findById: async (id) => {
        const sql = 'SELECT * FROM participants WHERE participant_id = ?';
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    },

    delete: async (id) => {
        const sql = 'DELETE FROM participants WHERE participant_id = ?';
        const [result] = await db.execute(sql, [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Participant;
