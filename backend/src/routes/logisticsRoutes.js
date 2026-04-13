const express = require('express');
const { createShipment } = require('../controllers/logisticsController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/ship', authMiddleware, adminMiddleware, createShipment);

module.exports = router;
