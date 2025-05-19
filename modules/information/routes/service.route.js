const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');

router.get('/', serviceController.getAllServices);
router.post('/', serviceController.createService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;