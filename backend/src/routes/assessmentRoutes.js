const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { saveResults, getParticipantResults, getDetailedResult, getAllResults } = require('../controllers/assessmentController');

router.get('/', authMiddleware, getAllResults);
router.post('/save', authMiddleware, saveResults);
router.get('/participant/:participantId', authMiddleware, getParticipantResults);
router.get('/:assessmentId', authMiddleware, getDetailedResult);

module.exports = router;
