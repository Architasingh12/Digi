const express = require('express');
const router = express.Router();
const { register, login, participantLogin, getMe } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/participant-login', participantLogin);
router.get('/me', authMiddleware, getMe);

module.exports = router;
