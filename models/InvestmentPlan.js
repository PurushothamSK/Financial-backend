const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalMonthlyInvestment: { type: Number, required: true },
  safeAssetPercentage: { type: Number, required: true },
  stockMarketPercentage: { type: Number, required: true },
  blendedReturn: { type: Number, required: true },
  safeInvestments: {
    vpf: Number,
    rd: Number,
    bills: Number,
    gold: Number,
    bonds: Number
  },
  stockInvestments: {
    largecap: Number,
    stocks: Number,
    smallcap: Number
  }
});


module.exports = mongoose.model('Investment', investmentSchema);
