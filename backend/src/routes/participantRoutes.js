const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getParticipants, createParticipant } = require('../controllers/participantController');

router.get('/', authMiddleware, getParticipants);
router.post('/', authMiddleware, createParticipant);

module.exports = router;
