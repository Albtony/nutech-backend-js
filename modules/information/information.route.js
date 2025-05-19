const express = require('express');
const router = express.Router();

const bannerRoutes = require('./routes/banner.route');
const serviceRoutes = require('./routes/service.route');

router.use('/', bannerRoutes);
router.use('/', serviceRoutes);

module.exports = router;
