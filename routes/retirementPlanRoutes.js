const express = require('express');
const router = express.Router();
const { saveRetirementPlan, getRetirementPlan } = require('../controllers/retirementPlanController');
const auth = require('../middleware/authMiddleware');

router.post('/retirement', auth(), saveRetirementPlan);
router.get('/retirement', auth(), getRetirementPlan);

module.exports = router;
