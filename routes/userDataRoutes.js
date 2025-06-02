const express = require('express');
const router = express.Router();
const { saveBasicInfo, saveIncome, saveExpenses, getIncomeData  } = require('../controllers/userDataController');
const auth = require('../middleware/authMiddleware')
const { getAllUsers } = require('../controllers/getUserController');

router.post('/basic-info', auth(),  saveBasicInfo);
router.post('/income', auth(), saveIncome);
router.post('/expense', auth(), saveExpenses);


router.get('/income', auth(), getIncomeData);
router.get('/get-users', auth(), getAllUsers);

module.exports = router;
