const Company = require('../models/Company');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../../debug.log');

const log = (msg) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
};

const getCompanies = async (req, res) => {
    try {
        const companies = await Company.findAll();
        const safeCompanies = companies.map(c => {
            const { password, ...rest } = c;
            return rest;
        });
        res.json(safeCompanies);
    } catch (error) {
        log(`Controller Error in getCompanies: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const createCompany = async (req, res) => {
    try {
        log("--- Create Company Request ---");
        log(`Body: ${JSON.stringify(req.body)}`);

        const { firstname, lastname, company_title, email, password, license_qty, expiry_date, phone, country_code, status } = req.body;

        const existing = await Company.findByEmail(email);
        if (existing) {
            log(`Error: Email already exists: ${email}`);
            return res.status(400).json({ message: 'Company email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const fullPhone = phone && country_code ? `${country_code} ${phone}` : phone;

        log(`Attempting to create company with expiry: ${expiry_date}`);

        const id = await Company.create({
            firstname,
            lastname,
            company_title,
            email,
            password: hashedPassword,
            license_qty: parseInt(license_qty) || 0,
            license_expiry: expiry_date,
            phone: fullPhone,
            status: status ? 1 : 0,
            created_ip: req.ip
        });

        log(`Success: Company created with ID ${id}`);
        res.status(201).json({ message: 'Company created successfully', id });
    } catch (error) {
        log(`Controller Error in createCompany: ${error.message}`);
        if (error.sqlMessage) log(`SQL Error: ${error.sqlMessage}`);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};

const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.phone && data.country_code) {
            data.phone = `${data.country_code} ${data.phone}`;
        }
        if (data.status !== undefined) data.status = data.status ? 1 : 0;
        if (data.expiry_date) data.license_expiry = data.expiry_date;

        const success = await Company.update(id, data);
        if (success) {
            res.json({ message: 'Company updated successfully' });
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        log(`Controller Error in updateCompany: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await Company.delete(id);
        if (success) {
            res.json({ message: 'Company deleted successfully' });
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        log(`Controller Error in deleteCompany: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCompanies, createCompany, updateCompany, deleteCompany };
