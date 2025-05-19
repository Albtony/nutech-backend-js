const express = require('express');
const router = express.Router();

const membershipRoutes = require('./modules/membership.route');
const informationRoutes = require('./modules/information.route');

router.use('/membership', membershipRoutes);
router.use('/information', informationRoutes);

module.exports = router;