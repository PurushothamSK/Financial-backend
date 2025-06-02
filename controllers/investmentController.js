const Investment = require('../models/InvestmentPlan');

exports.saveInvestment = async (req, res) => {
  try {
    const {
      totalMonthlyInvestment,
      safeAssetPercentage,
      stockMarketPercentage,
      blendedReturn,
      safeInvestments,
      stockInvestments,
    } = req.body;

    const investment = new Investment({
      userId: req.user.id, // ✅ pulled from decoded token
      totalMonthlyInvestment,
      safeAssetPercentage,
      stockMarketPercentage,
      blendedReturn,
      safeInvestments,
      stockInvestments,
    });

    await investment.save();
    res.status(200).json({ message: 'Investment data saved successfully' });
  } catch (error) {
    console.warn('Save investment error:', error);
    res.status(500).json({ message: 'Error saving investment data', error });
  }
};


exports.getInvestment = async (req, res) => {
  try {
    const { userId } = req.user;

    const investment = await Investment.findOne({ userId });
    if (!investment) return res.status(404).json({ error: 'No investment data found' });

    res.json(investment);
  } catch (error) {
    console.error('Fetch investment error:', error);
    res.status(500).json({ error: 'Server error fetching investment' });
  }
};
