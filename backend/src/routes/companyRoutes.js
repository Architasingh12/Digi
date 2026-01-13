const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getCompanies, createCompany, updateCompany, deleteCompany } = require('../controllers/companyController');

// All company routes detailed here. Protected by authMiddleware.
// Assumption: Current logged in user is a Super Admin or similar who can manage companies.
// If authMiddleware checks for "valid token", that might be enough if "Companies" are the only users.
router.get('/', authMiddleware, getCompanies);
router.post('/', authMiddleware, createCompany);
router.put('/:id', authMiddleware, updateCompany);
router.delete('/:id', authMiddleware, deleteCompany);

module.exports = router;
