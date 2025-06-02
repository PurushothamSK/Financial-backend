const FinancialData = require('../models/financialData');
const RetirementPlan = require('../models/retirementPlanModel');

const simulateRetirement = async (req, res) => {
  try {
     const userId = req.user.id;

    // Get Financial Info
    const financial = await FinancialData.findOne({ userId });
    if (!financial) return res.status(404).json({ message: 'Financial data not found' });

    const {
      currentAge: startAge,
      retirementAge,
      lifeExpectancy,
      inflation: inflationRate,
      taxRates,
    } = financial.basicInfo;

    const { monthlyExcess } = financial.excessInfo;

    // Get Retirement Plan
    const plan = await RetirementPlan.findOne({ user: userId });
    if (!plan) return res.status(404).json({ message: 'Retirement plan not found' });

    let {
      currentSavings,
      stepUp,
      postRetirementMonthlyAmount,
      currentDistribution,
      postDistribution
    } = plan;

    // Helper: Calculate blended return
    const getBlendedReturn = (distribution) => {
      return distribution.reduce((total, asset) => {
        const effectiveReturn = asset.return * (1 - asset.tax / 100);
        return total + (asset.share / 100) * effectiveReturn;
      }, 0);
    };

    const preRetirementReturn = getBlendedReturn(currentDistribution);
    const postRetirementReturn = getBlendedReturn(postDistribution);

    let results = [];
    let age = startAge;
    let savings = currentSavings;

    while (age <= lifeExpectancy) {
      const isRetired = age >= retirementAge;
      const plannedExpenses = isRetired ? postRetirementMonthlyAmount * 12 : 0;
      const additionalExpenses = isRetired
        ? plannedExpenses * ((inflationRate / 100) * (age - retirementAge))
        : 0;

      const totalExpenses = plannedExpenses + additionalExpenses;
      const investmentReturnRate = isRetired ? postRetirementReturn : preRetirementReturn;

      const investmentGain = savings * (investmentReturnRate / 100);
      const yearlyExcess = isRetired ? 0 : monthlyExcess * 12 * Math.pow(1 + stepUp / 100, age - startAge);
      const newSavings = savings + investmentGain + yearlyExcess - totalExpenses;

      results.push({
        age,
        startingSaving: savings.toFixed(2),
        plannedExpenses: plannedExpenses.toFixed(2),
        additionalExpenses: additionalExpenses.toFixed(2),
        additionalSavings: yearlyExcess.toFixed(2),
        endingSaving: newSavings.toFixed(2),
        status: age <= lifeExpectancy ? 'Alive' : 'Dead',
        retirementYear: isRetired ? retirementAge : '',
        warning: newSavings < 0 ? 'Negative balance!' : ''
      });

      savings = newSavings;
      age++;
    }

    res.status(200).json({ data: results });
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  simulateRetirement
};
