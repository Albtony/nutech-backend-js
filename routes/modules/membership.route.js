const express = require('express');
const router = express.Router();

const authRoutes = require('../../modules/membership/routes/auth.route');
const profileRoutes = require('../../modules/membership/routes/profile.route');

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);

module.exports = router;