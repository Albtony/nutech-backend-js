const express = require('express');
const router = express.Router();

const informationRoutes = require('./modules/information.route');

router.use('/information', informationRoutes);

module.exports = router;