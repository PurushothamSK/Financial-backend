const express = require('express');
const router = express.Router();
const { saveInvestment, getInvestment } = require('../controllers/investmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/investment', authMiddleware(), saveInvestment);
router.get('/investment', authMiddleware(), getInvestment);

module.exports = router;
