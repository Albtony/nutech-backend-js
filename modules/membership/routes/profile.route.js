const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../../../middlewares/auth.middleware');

router.get('/', authMiddleware, profileController.getProfile);
router.put('/update', authMiddleware, profileController.updateProfile);
router.put('/image', authMiddleware, profileController.updateProfileImage);

module.exports = router;