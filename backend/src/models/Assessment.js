const db = require('../config/db');

const Assessment = {
    create: async (data) => {
        const { participant_id, session_id, section, overall_score, confidence, overall_comments } = data;
        const sql = `INSERT INTO assessments (participant_id, session_id, section, overall_score, confidence, overall_comments) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [participant_id, session_id, section, overall_score, confidence, overall_comments]);
        return result.insertId;
    },

    findByParticipantId: async (participantId) => {
        const sql = 'SELECT * FROM assessments WHERE participant_id = ? ORDER BY created_at DESC';
        const [rows] = await db.execute(sql, [participantId]);
        return rows;
    },

    getById: async (id) => {
        const sql = 'SELECT * FROM assessments WHERE assessment_id = ?';
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    },

    findAll: async () => {
        const sql = 'SELECT * FROM assessments ORDER BY created_at DESC';
        const [rows] = await db.execute(sql);
        return rows;
    }
};

module.exports = Assessment;
