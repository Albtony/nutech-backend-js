const express = require('express');
const router = express.Router();

const balanceRoute = require('./routes/userBalance.route');
const transactionRoute = require('./routes/transaction.route');

router.use('/transaction', transactionRoute);
router.use('/', balanceRoute);

module.exports = router;