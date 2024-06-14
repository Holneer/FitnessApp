document.addEventListener('DOMContentLoaded', function() {

    const userSelect = document.getElementById('select-user');
    const loadUserButton = document.getElementById('load-user');
    const deleteUserButton = document.getElementById('delete-user'); // Delete button
    const dataForm = document.getElementById('data-form');
    const bmiResult = document.getElementById('bmi-result');

    // Load users into the select dropdown
    fetch('/api/userData')
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.name;
                option.textContent = user.name;
                userSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching users:', error));

    // Load user data when the button is clicked
    loadUserButton.addEventListener('click', function() {
        const userName = userSelect.value;
        if (userName) {
            fetch(`/api/userData/${userName}`)
                .then(response => response.json())
                .then(user => {
                    document.getElementById('name').value = user.name;
                    document.getElementById('height').value = user.height;
                    document.getElementById('weight').value = user.weight;
                    document.getElementById('age').value = user.age;
                    document.getElementById('gender').value = user.gender;
                })
                .catch(error => console.error('Error loading user data:', error));
        }
    });

    // Delete user data when the delete button is clicked
    deleteUserButton.addEventListener('click', function() {
        const userName = userSelect.value;
        if (userName) {
            fetch(`/api/userData/${userName}`, {
                method: 'DELETE'
            })
            .then(response => response.ok ? response.text() : Promise.reject(response.statusText))
            .then(message => {
                alert(message);
                location.reload(); // Refresh the page to update the user list
            })
            .catch(error => console.error('Error deleting user:', error));
        }
    });

    // Handle form submission
    dataForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(dataForm);
        const userData = {};
        formData.forEach((value, key) => {
            userData[key] = value;
        });

        const height = parseFloat(userData.height) / 100; // Convert cm to meters
        const weight = parseFloat(userData.weight);
        const bmi = weight / (height * height);
        userData.bmi = bmi.toFixed(2);
        userData.bmiCategory = getBmiCategory(bmi, userData.gender); // Update function call

        fetch(`/api/userData/save/${userData.name}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.ok ? response.text() : Promise.reject(response.statusText))
        .then(message => {
            bmiResult.textContent = `Ваш ІМТ становить ${userData.bmi}`;
        })
        .catch(error => console.error('Error saving user data:', error));
    });

    function getBmiCategory(bmi, gender) {
        if (gender === 'male') {
            if (bmi < 15) return 'Сильна недовага';
            if (bmi < 18.6) return 'Недовага';
            if (bmi < 25) return 'Нормальна вага';
            if (bmi < 30) return 'Зайва вага';
            return 'Ожиріння';
        } else {
            if (bmi < 15) return 'Сильна недовага';
            if (bmi < 19) return 'Недовага';
            if (bmi < 26) return 'Нормальна вага';
            if (bmi < 32) return 'Зайва вага';
            return 'Ожиріння';
        }
    }    
});
