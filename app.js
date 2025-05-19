require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const mainRouter = require('./modules/route'); 

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');

const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use('/', mainRouter);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;