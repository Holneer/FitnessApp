const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    height: Number,
    weight: Number,
    age: Number,
    gender: String,
    bmi: Number,
    bmiCategory: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
