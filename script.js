document.addEventListener('DOMContentLoaded', function() {
    // Dropdown functionality
    const dropdown = document.getElementById('servicesDropdown');
    const dropdownButton = dropdown.querySelector('.dropbtn');
    
    dropdown.addEventListener('mouseenter', function() {
        dropdownButton.setAttribute('aria-expanded', 'true');
    });
    
    dropdown.addEventListener('mouseleave', function() {
        dropdownButton.setAttribute('aria-expanded', 'false');
    });

    // Button click handlers
    const adoptButton = document.querySelector('.btn.primary');
    adoptButton.addEventListener('click', function() {
        // Add adoption functionality here
        console.log('Adopt Now clicked');
    });

    function navigateToAdopt() {
    window.location.href = "https://supertails.com/?srsltid=AfmBOormUvgL-MRKKWJloQlD2ubOHALl6PSG1NZKBUZ2fAG4x76KvNUK"; 
    }
    const browseButton = document.querySelector('.btn.secondary');
    browseButton.addEventListener('click', function() {
        // Add browse functionality here
        console.log('Browse Pets clicked');
    });

    const cartButton = document.querySelector('.cart-button');
    cartButton.addEventListener('click', function() {
        // Add cart functionality here
        console.log('Cart clicked');
    });

    const loginButton = document.querySelector('.login-button');
    loginButton.addEventListener('click', function() {
        // Add login functionality here
        console.log('Login clicked');
    });

    // Handle navigation links
    const navLinks = document.querySelectorAll('.dropdown-content a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Add navigation functionality here
            console.log('Navigation link clicked:', this.textContent);
        });
    });

    

    // Handle footer links
    const footerLinks = document.querySelectorAll('.footer-section a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Add footer link functionality here
            console.log('Footer link clicked:', this.textContent);
        });
    });
});
