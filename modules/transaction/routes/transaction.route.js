const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../../../middlewares/auth.middleware');

router.post('/', authMiddleware, transactionController.postTransaction);
router.get('/history', authMiddleware, transactionController.getTransactionHistory);

module.exports = router;