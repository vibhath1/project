 document.getElementById('signupForm').addEventListener('submit', function(e) {
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

            // Here you would typically send the data to a backend service
            // For this example, we'll just log to console
            console.log('Signup submitted:', { name, email });
            alert('Signup successful!');
        });