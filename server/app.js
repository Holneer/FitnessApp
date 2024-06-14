const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/fitnessApp', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// Import userData routes
const userDataRoutes = require('./routes/userData');
app.use('/api/userData', userDataRoutes); // Ensure this line is correct

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
