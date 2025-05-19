const express = require('express');
const router = express.Router();

const authRoutes = require('./routes/auth.route');
const profileRoutes = require('./routes/profile.route');

router.use('/', authRoutes);
router.use('/profile', profileRoutes);

module.exports = router;