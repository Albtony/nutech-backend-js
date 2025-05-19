const express = require('express');
const router = express.Router();

const authRoutes = require('../../modules/membership/routes/auth.route');

router.use('/auth', authRoutes);

module.exports = router;