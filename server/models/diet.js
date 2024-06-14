const mongoose = require('mongoose');

const dietSchema = new mongoose.Schema({
    name: String,
    description: String,
    bmiCategory: String, // Ensure this field matches the bmiCategory values
    forWeightLoss: Boolean,
    forWeightGain: Boolean
});

const Diet = mongoose.model('Diet', dietSchema);

module.exports = Diet;
