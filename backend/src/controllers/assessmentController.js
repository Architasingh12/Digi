const Assessment = require('../models/Assessment');
const Competency = require('../models/Competency');

const saveResults = async (req, res) => {
    try {
        const { participant_id, session_id, section, results } = req.body;

        // results is the object from DigiReady API response (res.result)
        const overall_score = results.digital_adaptability.score;
        const confidence = results.confidence * 100;
        const overall_comments = results.overall_comments;

        const assessmentId = await Assessment.create({
            participant_id,
            session_id,
            section,
            overall_score,
            confidence,
            overall_comments
        });

        // Prepare competencies for bulk insertion
        const competencies = [];

        // Digital Competence
        Object.entries(results.digital_competence).forEach(([name, data]) => {
            competencies.push({
                name,
                score: data.score,
                rationale: data.rationale,
                evidence: data.evidence,
                type: 'competence'
            });
        });

        // Digital Mindset
        Object.entries(results.digital_mindset).forEach(([name, data]) => {
            competencies.push({
                name,
                score: data.score,
                rationale: data.rationale,
                evidence: data.evidence,
                type: 'mindset'
            });
        });

        await Competency.bulkCreate(assessmentId, competencies);

        res.status(201).json({ message: 'Assessment result saved successfully', assessmentId });
    } catch (error) {
        console.error('Save result error:', error);
        res.status(500).json({ message: error.message });
    }
};

const getParticipantResults = async (req, res) => {
    try {
        const participantId = req.params.participantId;
        const assessments = await Assessment.findByParticipantId(participantId);
        res.json(assessments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDetailedResult = async (req, res) => {
    try {
        const assessmentId = req.params.assessmentId;
        const assessment = await Assessment.getById(assessmentId);
        if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

        const competencies = await Competency.findByAssessmentId(assessmentId);
        res.json({ ...assessment, competencies });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllResults = async (req, res) => {
    try {
        const assessments = await Assessment.findAll();
        res.json(assessments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { saveResults, getParticipantResults, getDetailedResult, getAllResults };
