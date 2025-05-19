require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const mainRouter = require('./routes/route'); 

const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use('/', mainRouter);

module.exports = app;