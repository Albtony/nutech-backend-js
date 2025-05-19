const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/banner.controller');

router.get('/banner', bannerController.getAllBanners);
router.post('/banner', bannerController.createBanner);
router.delete('/banner:id', bannerController.deleteBanner);

module.exports = router;