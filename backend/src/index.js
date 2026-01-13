const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/participants', require('./routes/participantRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));

// Routes Placeholder
app.get('/', (req, res) => {
    res.json({ message: 'Digi-Ready Backend API is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
