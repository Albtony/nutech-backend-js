const express = require('express');
const router = express.Router();
const userBalanceController = require('../controllers/userBalance.controller');
const authMiddleware = require('../../../middlewares/auth.middleware');

router.get('/', authMiddleware, userBalanceController.getBalance);
router.post('/topup', authMiddleware, userBalanceController.topUp);

module.exports = router;