document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Basic validation
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Prepare the data to send
    const userData = {
        name: name,
        email: email,
        password: password
    };

    try {
        // Send the data to the backend
        const response = await fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        // Handle the response
        if (response.ok) {
            const result = await response.json();
            alert(result.message); // Show success message
        } else {
            const error = await response.json();
            alert(error.error || 'An error occurred'); // Show error message
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Failed to connect to the server');
    }
});