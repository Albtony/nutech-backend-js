const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');

router.get('/services', serviceController.getAllServices);
router.post('/services', serviceController.createService);
router.delete('/services:id', serviceController.deleteService);

module.exports = router;