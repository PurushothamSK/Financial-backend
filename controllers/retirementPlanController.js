const RetirementPlan = require('../models/retirementPlanModel');

exports.saveRetirementPlan = async (req, res) => {
  const userId = req.user.id;
  const {
    currentSavings,
    stepUp,
    inflation,
    postRetirementMonthlyAmount,
    currentDistribution,
    postDistribution
  } = req.body;

  try {
    let plan = await RetirementPlan.findOne({ user: userId });

    if (plan) {
      // Update existing
      plan.currentSavings = currentSavings;
      plan.stepUp = stepUp;
      plan.inflation = inflation;
      plan.postRetirementMonthlyAmount = postRetirementMonthlyAmount;
      plan.currentDistribution = currentDistribution;
      plan.postDistribution = postDistribution;
      await plan.save();
      return res.json({ message: 'Retirement plan updated successfully' });
    } else {
      // Create new
      plan = new RetirementPlan({
        user: userId,
        currentSavings,
        stepUp,
        inflation,
        postRetirementMonthlyAmount,
        currentDistribution,
        postDistribution
      });
      await plan.save();
      return res.json({ message: 'Retirement plan saved successfully' });
    }
  } catch (err) {
    console.error('Error saving retirement plan:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getRetirementPlan = async (req, res) => {
  const userId = req.user.id;

  try {
    const plan = await RetirementPlan.findOne({ user: userId });
    if (!plan) return res.status(404).json({ message: 'No retirement plan found' });
    res.json(plan);
  } catch (err) {
    console.error('Error fetching retirement plan:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
