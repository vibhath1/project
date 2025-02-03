document.addEventListener('DOMContentLoaded', function() {
    const loginTypeSelection = document.getElementById('loginTypeSelection');
    const userLoginCard = document.getElementById('userLoginCard');
    const adminLoginCard = document.getElementById('adminLoginCard');
    const userLoginForm = document.getElementById('userLoginForm');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const backButtons = document.querySelectorAll('.back-button');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    let failedAttempts = { user: 0, admin: 0 };
    let lastAttemptTime = { user: 0, admin: 0 };
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_TIME = 15 * 60 * 1000;

    function showLoginTypeSelection() {
        loginTypeSelection.classList.remove('hidden');
        userLoginCard.classList.add('hidden');
        adminLoginCard.classList.add('hidden');
    }

    function showLoginForm(type) {
        loginTypeSelection.classList.add('hidden');
        userLoginCard.classList.toggle('hidden', type !== 'user');
        adminLoginCard.classList.toggle('hidden', type !== 'admin');
    }

    document.querySelectorAll('.login-option-btn').forEach(button => {
        button.addEventListener('click', function() {
            showLoginForm(this.dataset.type);
        });
    });

    backButtons.forEach(button => {
        button.addEventListener('click', showLoginTypeSelection);
    });

    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            input.type = input.type === 'password' ? 'text' : 'password';
            this.querySelector('.show-password').classList.toggle('hidden');
            this.querySelector('.hide-password').classList.toggle('hidden');
            this.setAttribute('aria-label', input.type === 'password' ? 'Show password' : 'Hide password');
        });
    });

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePassword(password) {
        return {
            isValid: password.length >= 8 && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password),
            errors: [
                password.length < 8 && 'Password must be at least 8 characters long',
                !/\d/.test(password) && 'Password must contain at least one number',
                !/[!@#$%^&*(),.?":{}|<>]/.test(password) && 'Password must contain at least one special character'
            ].filter(Boolean)
        };
    }

    function validateUsername(username) {
        return username.length >= 4;
    }

    document.getElementById('userEmail').addEventListener('input', function() {
        const errorElement = document.getElementById('userEmailError');
        errorElement.textContent = validateEmail(this.value) ? '' : 'Please enter a valid email address';
    });

    document.getElementById('userPassword').addEventListener('input', function() {
        const validation = validatePassword(this.value);
        document.getElementById('userPasswordError').textContent = validation.isValid ? '' : validation.errors[0];
    });

    document.getElementById('adminUsername').addEventListener('input', function() {
        document.getElementById('adminUsernameError').textContent = validateUsername(this.value) ? '' : 'Username must be at least 4 characters long';
    });

    document.getElementById('adminPassword').addEventListener('input', function() {
        const validation = validatePassword(this.value);
        document.getElementById('adminPasswordError').textContent = validation.isValid ? '' : validation.errors[0];
    });

    function generateCSRFToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    const csrfToken = generateCSRFToken();
    sessionStorage.setItem('csrfToken', csrfToken);

    async function simulateLoginRequest(type, data) {
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1500));
    }

    function handleFormSubmission(formType, event) {
        event.preventDefault();
        const now = Date.now();

        if (failedAttempts[formType] >= MAX_ATTEMPTS && (now - lastAttemptTime[formType]) < LOCKOUT_TIME) {
            alert(`Too many failed attempts. Please try again in ${Math.ceil((LOCKOUT_TIME - (now - lastAttemptTime[formType])) / 60000)} minutes.`);
            return;
        }

        const form = event.target;
        const button = form.querySelector('.login-button');
        const buttonText = button.querySelector('.button-text');
        const buttonLoader = button.querySelector('.button-loader');

        button.disabled = true;
        buttonText.classList.add('hidden');
        buttonLoader.classList.remove('hidden');

        setTimeout(async () => {
            try {
                const response = await simulateLoginRequest(formType, {
                    username: form.querySelector('input[type="text"]')?.value,
                    email: form.querySelector('input[type="email"]')?.value,
                    password: form.querySelector('input[type="password"]').value,
                    remember: form.querySelector('input[type="checkbox"]').checked,
                    csrfToken
                });

                if (response.success) {
                    failedAttempts[formType] = 0;
                    window.location.href = formType === 'admin' ? '/admin' : '/dashboard';
                } else {
                    throw new Error('Invalid credentials');
                }
            } catch (error) {
                failedAttempts[formType]++;
                lastAttemptTime[formType] = Date.now();
                document.getElementById(formType === 'admin' ? 'adminUsernameError' : 'userEmailError').textContent = `Invalid credentials (${MAX_ATTEMPTS - failedAttempts[formType]} attempts remaining)`;
            } finally {
                button.disabled = false;
                buttonText.classList.remove('hidden');
                buttonLoader.classList.add('hidden');
            }
        }, 1500);
    }

    userLoginForm.addEventListener('submit', (e) => handleFormSubmission('user', e));
    adminLoginForm.addEventListener('submit', (e) => handleFormSubmission('admin', e));

    document.getElementById('userPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') userLoginForm.querySelector('button[type="submit"]').click();
    });

    document.getElementById('adminPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') adminLoginForm.querySelector('button[type="submit"]').click();
    });
});

