const mongoose = require('mongoose');

const financialDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  basicInfo: {
    currentAge: Number,
    retirementAge: Number,
    lifeExpectancy: Number,
    inflation: { type: Number, default: 6 },
    taxRates: {
      capitalGainsTax: { type: Number, default: 20 },
      incomeTax: { type: Number, default: 30 }
    }
  },

  incomeInfo: {
    monthlyIncome: Number,
    yearlyIncome: Number,
    totalYearlyIncome: Number
  },

  excessInfo: {
    monthlyExcess: { type: Number, default: 0 },
    yearlyExcess: { type: Number, default: 0 }
  },

  expenseInfo: {
    totalMonthlyExpense: { type: Number, default: 0 },
    totalYearlyExpense: { type: Number, default: 0 },
    monthlyExpenses: [
      {
        name: { type: String },
        amount: { type: Number }
      }
    ],
    yearlyExpenses: [
      {
        name: { type: String },
        amount: { type: Number }
      }
    ]
  }

}, { timestamps: true });

module.exports = mongoose.model('FinancialData', financialDataSchema);
