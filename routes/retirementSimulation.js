const express = require('express');
const router = express.Router();
const { simulateRetirement } = require('../controllers/retirementController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/simulate-retirement', authMiddleware(), simulateRetirement);

module.exports = router;
