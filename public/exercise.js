document.addEventListener('DOMContentLoaded', () => {
    const userDataForm = document.getElementById('user-data-form');
    const exercisePlan = document.getElementById('exercise-plan');

    loadSavedUsers();

    async function loadSavedUsers() {
        try {
            const response = await fetch('/api/userData');
            const users = await response.json();
            const userSelect = document.getElementById('user');

            userSelect.innerHTML = '';
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.name;
                option.textContent = user.name;
                userSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    userDataForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userName = document.getElementById('user').value;
        const goal = document.getElementById('goal').value;

        console.log(`Fetching exercises for user: ${userName} with goal: ${goal}`);  // Add this line

        try {
            const response = await fetch(`/api/userData/${userName}/exercises?goal=${goal}`);
            const exercises = await response.json();

            console.log('Exercises received:', exercises);  // Add this line

            if (exercises.length > 0) {
                generateExercisePlan(exercises);
            } else {
                exercisePlan.textContent = 'Немає доступних планів вправ для вибраної цілі.';
            }
        } catch (error) {
            console.error('Error:', error);
            exercisePlan.textContent = 'Помилка отримання планів тренувань.';
        }
    });

    function generateExercisePlan(exercises) {
        exercisePlan.innerHTML = '';
        const limitedExercises = exercises.slice(0, 5); // Display only the first 3-5 exercises
        limitedExercises.forEach(exercise => {
            const exerciseItem = document.createElement('div');
            exerciseItem.className = 'exercise-item';
            exerciseItem.innerHTML = `
                <h3>${exercise.name}</h3>
                <p>${exercise.description}</p>
            `;
            exercisePlan.appendChild(exerciseItem);
        });
    }    
});
