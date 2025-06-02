const FinancialData = require("../models/financialData");

exports.saveBasicInfo = async (req, res) => {
  try {
    const {
      currentAge,
      retirementAge,
      lifeExpectancy,
      inflation,
      capitalGainsTax,
      incomeTax,
    } = req.body;

    const data = {
      userId: req.user.id,
      basicInfo: {
        currentAge,
        retirementAge,
        lifeExpectancy,
        inflation,
        taxRates: {
          capitalGainsTax,
          incomeTax,
        },
      },
    };

    const existing = await FinancialData.findOne({ userId: req.user.id });

    if (existing) {
      await FinancialData.updateOne({ userId: req.user.id }, { $set: data });
    } else {
      await FinancialData.create(data);
    }

    res.json({ message: "Basic info saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.saveIncome = async (req, res) => {
  const { monthlyIncome, yearlyIncome, totalYearlyIncome } = req.body;
  const userId = req.user.id;

  // Optional: Validate totals match
  if (totalYearlyIncome !== monthlyIncome * 12 + yearlyIncome) {
    return res.status(400).json({
      success: false,
      message: "Total yearly income does not match monthly and yearly inputs.",
    });
  }

  try {
    const updated = await FinancialData.findOneAndUpdate(
      { userId },
      {
        $set: {
          incomeInfo: {
            monthlyIncome,
            yearlyIncome,
            totalYearlyIncome,
          },
        },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, res: updated });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
};

exports.saveExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      totalMonthlyExpense,
      totalYearlyExpense,
      monthlyExcess,
      yearlyExcess,
      monthlyExpenses,
      yearlyExpenses
    } = req.body;

    let userData = await FinancialData.findOne({ userId });

    if (!userData) {
      userData = new FinancialData({ userId });
    }

    userData.excessInfo.monthlyExcess = monthlyExcess;
    userData.excessInfo.yearlyExcess = yearlyExcess;

    userData.expenseInfo = {
      totalMonthlyExpense,
      totalYearlyExpense,
      monthlyExpenses,
      yearlyExpenses
    };

    await userData.save();

    return res.status(200).json({ success: true, message: 'Expenses saved successfully' });
  } catch (error) {
    console.error('Error saving expenses:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
exports.getIncomeData = async (req, res) => {
  try {
    const data = await FinancialData.findOne({ userId: req.user.id });
    if (!data) return res.status(404).json({ message: "Data not found" });

    res.status(200).json({
      message: "Income data retrieved successfully",
      monthlyIncome: data.incomeInfo.monthlyIncome,
      yearlyIncome: data.incomeInfo.yearlyIncome,
      totalYearlyIncome: data.incomeInfo.totalYearlyIncome,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
