document.addEventListener('DOMContentLoaded', () => {
    const userDataForm = document.getElementById('user-data-form');
    const dietPlan = document.getElementById('diet-plan');
    const calorieInfo = document.getElementById('calorie-info');
    const calorieResult = document.getElementById('calorie-result');

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

        try {
            const userResponse = await fetch(`/api/userData/${userName}`);
            const user = await userResponse.json();

            const targetCalories = calculateTargetCalories(user.weight, goal, user.gender);
            calorieResult.textContent = targetCalories;
            calorieInfo.style.display = 'block';

            const dietResponse = await fetch(`/api/userData/${userName}/diets?goal=${goal}`);
            const diets = await dietResponse.json();

            if (diets.length > 0) {
                generateDietPlan(diets);
            } else {
                dietPlan.textContent = 'Немає доступних планів дієти для вибраної цілі.';
            }
        } catch (error) {
            console.error('Error:', error);
            dietPlan.textContent = 'Помилка отримання планів дієти.';
        }
    });

    function calculateTargetCalories(weight, goal, gender) {
        let targetCalories;
        if (goal === 'lose-weight') {
            targetCalories = (weight * 33) - 500;
            if (gender === 'male' && targetCalories < 1500) targetCalories = 1500;
            if (gender === 'female' && targetCalories < 1200) targetCalories = 1200;
        } else if (goal === 'gain-weight') {
            targetCalories = (weight * 33) + 200;
        }
        return targetCalories;
    }

    function generateDietPlan(diets) {
        dietPlan.innerHTML = '';
        const limitedDiets = diets.slice(0, 5); // Display only the first 3-5 diets
        limitedDiets.forEach(diet => {
            const dietItem = document.createElement('div');
            dietItem.className = 'diet-item';
            dietItem.innerHTML = `
                <h3>${diet.name}</h3>
                <p>${diet.description}</p>
            `;
            dietPlan.appendChild(dietItem);
        });
    }    
});
