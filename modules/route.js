const express = require('express');
const router = express.Router();

const membershipRoutes = require('./membership/membership.route');
const informationRoutes = require('./information/information.route');
const transactionRoutes = require('./transaction/transaction.route');

// if use {module}/path structure
// router.use('/membership', membershipRoutes);
// router.use('/information', informationRoutes);
// router.use('/transaction', transactionRoutes);

router.use('/', membershipRoutes);
router.use('/', informationRoutes);
router.use('/', transactionRoutes);

module.exports = router;