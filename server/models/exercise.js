const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: String,
    description: String,
    bmiCategory: String, // Ensure this field matches the bmiCategory values
    forWeightLoss: Boolean,
    forWeightGain: Boolean
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
