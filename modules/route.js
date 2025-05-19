const express = require('express');
const router = express.Router();

const membershipRoutes = require('./membership/membership.route');
const informationRoutes = require('./information/information.route');

router.use('/membership', membershipRoutes);
router.use('/information', informationRoutes);

module.exports = router;