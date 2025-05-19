const express = require('express');
const router = express.Router();

const bannerRoutes = require('./routes/banner.route');
const serviceRoutes = require('./routes/service.route');

router.use('/banner', bannerRoutes);
router.use('/service', serviceRoutes);

module.exports = router;
