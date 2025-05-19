const express = require('express');
const router = express.Router();

const bannerRoutes = require('../../modules/information/routes/banner.route');

router.use('/banner', bannerRoutes);

module.exports = router;
