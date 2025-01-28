document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const loginButton = document.getElementById('loginButton');
    const buttonText = loginButton.querySelector('.button-text');
    const buttonLoader = loginButton.querySelector('.button-loader');

    // Rate limiting variables
    let failedAttempts = 0;
    let lastAttemptTime = 0;
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        const showIcon = this.querySelector('.show-password');
        const hideIcon = this.querySelector('.hide-password');
        showIcon.classList.toggle('hidden');
        hideIcon.classList.toggle('hidden');
        
        // Update ARIA label
        this.setAttribute('aria-label', 
            type === 'password' ? 'Show password' : 'Hide password'
        );
    });

    // Input validation functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        const minLength = 8;
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return {
            isValid: password.length >= minLength && hasNumber && hasSpecial,
            errors: [
                password.length < minLength && 'Password must be at least 8 characters long',
                !hasNumber && 'Password must contain at least one number',
                !hasSpecial && 'Password must contain at least one special character'
            ].filter(Boolean)
        };
    }

    // Real-time validation
    emailInput.addEventListener('input', function() {
        const isValid = validateEmail(this.value);
        this.classList.toggle('error', !isValid);
        
        const errorElement = document.getElementById('emailError');
        errorElement.textContent = isValid ? '' : 'Please enter a valid email address';
    });

    passwordInput.addEventListener('input', function() {
        const validation = validatePassword(this.value);
        this.classList.toggle('error', !validation.isValid);
        
        const errorElement = document.getElementById('passwordError');
        errorElement.textContent = validation.isValid ? '' : validation.errors[0];
    });

    // CSRF Protection
    function generateCSRFToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    // Store CSRF token in session storage
    const csrfToken = generateCSRFToken();
    sessionStorage.setItem('csrfToken', csrfToken);

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Check rate limiting
        const now = Date.now();
        if (failedAttempts >= MAX_ATTEMPTS && (now - lastAttemptTime) < LOCKOUT_TIME) {
            const remainingTime = Math.ceil((LOCKOUT_TIME - (now - lastAttemptTime)) / 60000);
            alert(`Too many failed attempts. Please try again in ${remainingTime} minutes.`);
            return;
        }

        // Validate inputs
        const email = emailInput.value;
        const password = passwordInput.value;
        
        const emailValid = validateEmail(email);
        const passwordValid = validatePassword(password).isValid;

        if (!emailValid || !passwordValid) {
            return;
        }

        // Show loading state
        loginButton.disabled = true;
        buttonText.classList.add('hidden');
        buttonLoader.classList.remove('hidden');

        try {
            // Simulate API call with artificial delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Here you would normally make an API call to your backend
            const response = await simulateLoginRequest({
                email,
                password,
                csrfToken,
                remember: document.getElementById('remember').checked
            });

            if (response.success) {
                // Reset failed attempts on successful login
                failedAttempts = 0;
                
                // Redirect to dashboard or home page
                window.location.href = '/';
            } else {
                throw new Error('Invalid credentials');
            }

        } catch (error) {
            // Handle failed login attempt
            failedAttempts++;
            lastAttemptTime = Date.now();

            const errorElement = document.getElementById('emailError');
            errorElement.textContent = 'Invalid email or password';
            
            // Show remaining attempts
            const remainingAttempts = MAX_ATTEMPTS - failedAttempts;
            if (remainingAttempts > 0) {
                errorElement.textContent += ` (${remainingAttempts} attempts remaining)`;
            }

        } finally {
            // Reset button state
            loginButton.disabled = false;
            buttonText.classList.remove('hidden');
            buttonLoader.classList.add('hidden');
        }
    });

    // Simulate login request (replace with actual API call)
    async function simulateLoginRequest(data) {
        // This is just a simulation - replace with actual API call
        return new Promise((resolve) => {
            // Simulate successful login for demo purposes
            // In production, this would be an actual API call
            resolve({ success: true });
        });
    }

    // Handle "Enter" key in password field
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            loginButton.click();
        }
    });
});