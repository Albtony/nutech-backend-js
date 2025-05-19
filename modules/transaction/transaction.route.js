const express = require('express');
const router = express.Router();

const balanceRoute = require('./routes/userBalance.route');
const transactionRoute = require('./routes/transaction.route');

router.use('/', transactionRoute);
router.use('/balance', balanceRoute);

module.exports = router;