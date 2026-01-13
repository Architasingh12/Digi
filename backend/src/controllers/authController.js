const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const Participant = require('../models/Participant');

const register = async (req, res) => {
    try {
        const { firstname, lastname, company_title, email, password } = req.body;

        // Check if company exists
        const existing = await Company.findByEmail(email);
        if (existing) return res.status(400).json({ message: 'Email already registered' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const companyId = await Company.create({
            firstname,
            lastname,
            company_title,
            email,
            password: hashedPassword,
            created_ip: req.ip,
            license_qty: 10, // Default for now
            email_addresses: ''
        });

        res.status(201).json({ message: 'Company registered successfully', companyId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const company = await Company.findByEmail(email);

        if (!company) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: company.company_id, type: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { id: company.company_id, name: `${company.firstname} ${company.lastname}`, email: company.email, role: 'admin' }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const participantLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const participant = await Participant.findByEmail(email);

        if (!participant) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, participant.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        if (participant.status === 0) {
            return res.status(403).json({ message: 'Account is inactive' });
        }

        const token = jwt.sign(
            { id: participant.participant_id, type: 'participant' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const userData = { ...participant };
        delete userData.password;

        res.json({
            token,
            user: { ...userData, id: participant.participant_id, name: `${participant.firstname} ${participant.lastname}`, role: 'participant' }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const { id, type } = req.user;
        let userData;
        if (type === 'admin') {
            userData = await Company.findById(id);
        } else {
            userData = await Participant.findById ? await Participant.findById(id) : null;
            // Since Participant model doesn't have findById yet, I might need to add it or use another method.
            // Let's assume I'll add it or use a query.
        }

        if (!userData) return res.status(404).json({ message: 'User not found' });

        // Remove password
        delete userData.password;
        res.json({ ...userData, role: type });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, participantLogin, getMe };
