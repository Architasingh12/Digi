const db = require('../config/db');

const Competency = {
    bulkCreate: async (assessmentId, competencies) => {
        if (!competencies || competencies.length === 0) return;

        const sql = `INSERT INTO competencies (assessment_id, name, score, rationale, evidence, type) 
                     VALUES ?`;

        const values = competencies.map(c => [
            assessmentId,
            c.name,
            c.score,
            c.rationale,
            JSON.stringify(c.evidence),
            c.type
        ]);

        const [result] = await db.query(sql, [values]);
        return result;
    },

    findByAssessmentId: async (assessmentId) => {
        const sql = 'SELECT * FROM competencies WHERE assessment_id = ?';
        const [rows] = await db.execute(sql, [assessmentId]);
        return rows;
    }
};

module.exports = Competency;
