document.addEventListener('DOMContentLoaded', async function () {
    // Dropdown functionality
    const dropdown = document.getElementById('servicesDropdown');
    const dropdownButton = dropdown?.querySelector('.dropbtn');
    const dropdownContent = dropdown?.querySelector('.dropdown-content');

    if (dropdownButton) {
        dropdownButton.addEventListener('click', function (event) {
            event.stopPropagation();
            dropdownContent.classList.toggle('show');
        });
    }

    document.addEventListener('click', function (event) {
        if (dropdown && !dropdown.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });

    // Handle buttons
    document.querySelector('.btn.primary')?.addEventListener('click', function () {
        console.log('Adopt Now clicked');
    });

    document.querySelector('.btn.secondary')?.addEventListener('click', function () {
        console.log('Browse Pets clicked');
    });

    document.querySelector('.cart-button')?.addEventListener('click', function () {
        console.log('Cart clicked');
    });

    const loginButton = document.querySelector('.login-button');

    // Dynamic Login/Logout Button
    async function checkAuthStatus() {
        const token = localStorage.getItem('jwt_token');
        
        if (!token) {
            loginButton.textContent = 'Login';
            loginButton.href = '/login.html';
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/auth/status', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to check auth status');

            const data = await response.json();
            console.log("Auth status response:", data);

            if (data.logged_in) {
                loginButton.textContent = 'Logout';
                loginButton.href = '#';
                loginButton.removeEventListener('click', logout); // Remove previous event listener to prevent duplication
                loginButton.addEventListener('click', logout);
            } else {
                loginButton.textContent = 'Login';
                loginButton.href = '/login.html';
            }
        } catch (error) {
            console.error('Error checking authentication status:', error);
            loginButton.textContent = 'Login';
            loginButton.href = '/login.html';
        }
    }

    function logout(event) {
        event.preventDefault();
        localStorage.removeItem('jwt_token');
        window.location.reload();
    }

    checkAuthStatus();

    // Handle navigation links
    const navLinks = document.querySelectorAll('.dropdown-content a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            if (!['register-pet.html', 'boarding.html', 'grooming.html', 'consult.html'].some(path => this.href.includes(path))) {
                e.preventDefault();
            }
            console.log('Navigation link clicked:', this.textContent);
        });
    });

    // Handle footer links
    const footerLinks = document.querySelectorAll('.footer-section a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            if (!['register-pet.html', 'boarding.html', 'grooming.html', 'consult.html'].some(path => this.href.includes(path))) {
                e.preventDefault();
            }
            console.log('Footer link clicked:', this.textContent);
        });
    });
});
