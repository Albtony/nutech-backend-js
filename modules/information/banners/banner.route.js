const express = require('express');
const router = express.Router();
const bannerController = require('./banner.controller');

router.get('/', bannerController.getAllBanners);
router.post('/', bannerController.createBanner);
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;