document.addEventListener('DOMContentLoaded', function () {
    // Dropdown functionality
    const dropdown = document.getElementById('servicesDropdown');
    const dropdownButton = dropdown.querySelector('.dropbtn');
    const dropdownContent = dropdown.querySelector('.dropdown-content');

    dropdownButton.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent click from bubbling up
        dropdownContent.classList.toggle('show'); // Toggle visibility
    });

    document.addEventListener('click', function (event) {
        if (!dropdown.contains(event.target)) {
            dropdownContent.classList.remove('show'); // Close if clicked outside
        }
    });

    // Button click handlers
    const adoptButton = document.querySelector('.btn.primary');
    adoptButton.addEventListener('click', function () {
        console.log('Adopt Now clicked');
    });

    const browseButton = document.querySelector('.btn.secondary');
    browseButton.addEventListener('click', function () {
        console.log('Browse Pets clicked');
    });

    const cartButton = document.querySelector('.cart-button');
    cartButton.addEventListener('click', function () {
        console.log('Cart clicked');
    });

    const loginButton = document.querySelector('.login-button');
    loginButton.addEventListener('click', function () {
        console.log('Login clicked');
    });
// Handle navigation links
const navLinks = document.querySelectorAll('.dropdown-content a');
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        if (!this.getAttribute('href').includes('register-pet.html') && 
            !this.getAttribute('href').includes('boarding.html') && 
            !this.getAttribute('href').includes('grooming.html')) {
            e.preventDefault();
        }
        console.log('Navigation link clicked:', this.textContent);
    });
});

// Handle footer links
const footerLinks = document.querySelectorAll('.footer-section a');
footerLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        if (!this.getAttribute('href').includes('register-pet.html') && 
            !this.getAttribute('href').includes('boarding.html') && 
            !this.getAttribute('href').includes('grooming.html')) {
            e.preventDefault();
        } 
        console.log('Footer link clicked:', this.textContent);
    });
});

