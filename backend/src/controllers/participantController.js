const Participant = require('../models/Participant');
const bcrypt = require('bcrypt');

const getParticipants = async (req, res) => {
    try {
        const companyId = req.user.id;
        const list = await Participant.findByCompanyId(companyId);
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createParticipant = async (req, res) => {
    try {
        const companyId = req.user.id;
        const {
            firstname, lastname, email, password, designation, level,
            user_id, section, industry, geography, company,
            function: function_area, division
        } = req.body;

        const existing = await Participant.findByEmail(email);
        if (existing) return res.status(400).json({ message: 'Participant email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const id = await Participant.create({
            company_id: companyId,
            firstname,
            lastname,
            email,
            password: hashedPassword,
            designation,
            level,
            user_id,
            section,
            industry,
            geography,
            company,
            function_area,
            division,
            created_ip: req.ip
        });

        res.status(201).json({ message: 'Participant created successfully', id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteParticipant = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await Participant.delete(id);
        if (success) {
            res.json({ message: 'Participant deleted successfully' });
        } else {
            res.status(404).json({ message: 'Participant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getParticipants, createParticipant, deleteParticipant };
