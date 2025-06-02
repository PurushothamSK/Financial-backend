const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: String,
  return: Number,
  tax: Number,
  share: Number,
  amount: Number,
}, { _id: false });

const retirementPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  currentSavings: Number,
  stepUp: Number,
  inflation: Number,
  postRetirementMonthlyAmount: Number,
  currentDistribution: [assetSchema],
  postDistribution: [assetSchema],
}, { timestamps: true });

module.exports = mongoose.model('RetirementPlan', retirementPlanSchema);
