const express = require('express');
const router = express.Router();
const User = require('../models/userData');
const Exercise = require('../models/exercise');
const Diet = require('../models/diet');

const categoryMapping = {
    'Нормальна вага': 'Normal weight',
    'Недовага': 'Underweight',
    'Зайва вага': 'Overweight',
    'Ожиріння': 'Obese',
    'Сильна недовага': 'Severely underweight',
    'All': 'All'
};

// Save user data
router.post('/save/:name', async (req, res) => {
    try {
        const userData = req.body;
        await User.updateOne({ name: req.params.name }, userData, { upsert: true });
        res.status(200).send('Data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Error saving data');
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).send('Error retrieving user data');
    }
});

// Get a specific user by name
router.get('/:name', async (req, res) => {
    try {
        const userName = req.params.name;
        const user = await User.findOne({ name: userName });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).send('Error retrieving user data');
    }
});

const getRandomItems = (array, num) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
};

// Get exercises based on BMI category and goal
router.get('/:name/exercises', async (req, res) => {
    try {
        const userName = req.params.name;
        const goal = req.query.goal;

        const user = await User.findOne({ name: userName });
        if (user) {
            const mappedCategory = categoryMapping[user.bmiCategory];

            let query = {
                $or: [
                    { bmiCategory: mappedCategory },
                    { bmiCategory: 'All' }
                ]
            };

            if (goal === 'lose-weight') {
                query.forWeightLoss = true;
            } else if (goal === 'gain-weight') {
                query.forWeightGain = true;
            }

            const exercises = await Exercise.find(query);
            const randomExercises = getRandomItems(exercises, 5); // Get 3 random exercises
            res.status(200).json(randomExercises);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error retrieving exercises:', error);
        res.status(500).send('Error retrieving exercises');
    }
});


// Get diets based on BMI category and goal
router.get('/:name/diets', async (req, res) => {
    try {
        const userName = req.params.name;
        const goal = req.query.goal;

        const user = await User.findOne({ name: userName });
        if (user) {
            const mappedCategory = categoryMapping[user.bmiCategory];

            let query = { 
                $or: [
                    { bmiCategory: mappedCategory }, 
                    { bmiCategory: 'All' }
                ]
            };

            if (goal === 'lose-weight') {
                query.forWeightLoss = true;
            } else if (goal === 'gain-weight') {
                query.forWeightGain = true;
            }

            const diets = await Diet.find(query);
            const randomDiets = getRandomItems(diets, 3); // Get 3 random diets
            res.status(200).json(randomDiets);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error retrieving diets:', error);
        res.status(500).send('Error retrieving diets');
    }
});

// Delete a specific user by name
router.delete('/:name', async (req, res) => {
    try {
        const userName = req.params.name;
        await User.deleteOne({ name: userName });
        res.status(200).send('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
});

module.exports = router;
