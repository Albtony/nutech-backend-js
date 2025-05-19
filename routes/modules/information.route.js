const express = require('express');
const router = express.Router();

const bannerRoutes = require('../../modules/information/routes/banner.route');
const serviceRoutes = require('../../modules/information/routes/service.route');

router.use('/banner', bannerRoutes);
router.use('/service', serviceRoutes);

module.exports = router;
