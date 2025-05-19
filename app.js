require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.get('/', (req, res) => res.status(200).json({ message: 'Server on' }));

module.exports = app;