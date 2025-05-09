document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle the booking form submission
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const petName = document.getElementById('petName').value.trim();
            const packageType = document.getElementById('package').value;
            const checkIn = new Date(document.getElementById('checkIn').value);
            const checkOut = new Date(document.getElementById('checkOut').value);
            const specialNeeds = document.getElementById('specialNeeds').value.trim();
            
            // Validate dates
            if (checkIn >= checkOut) {
                alert('Check-out date must be after check-in date.');
                return;
            }
            
            // Calculate length of stay
            const stayLength = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            
            // Calculate price based on package
            let basePrice = 0;
            switch(packageType) {
                case 'standard':
                    basePrice = 400;
                    break;
                case 'luxury':
                    basePrice = 999;
                    break;
                case 'vip':
                    basePrice = 2499;
                    break;
            }
            
            const totalPrice = basePrice * stayLength;
            
            // Create boarding object
            const boardingDetails = {
                id: Date.now(), // Unique ID
                petName: petName,
                packageType: packageType,
                checkIn: checkIn.toISOString().split('T')[0],
                checkOut: checkOut.toISOString().split('T')[0],
                specialNeeds: specialNeeds,
                totalPrice: totalPrice
            };
            
            // Save to backend
            try {
                const response = await fetch('http://127.0.0.1:5000/api/boardings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(boardingDetails)
                });
                if (!response.ok) {
                    throw new Error('Failed to save boarding');
                }
                const savedBoarding = await response.json();
                
                // Show confirmation message
                alert(`Booking request received! Your estimated total for ${stayLength} nights is ₹${totalPrice}. You'll be redirected to the confirmation page.`);
                
                // Store in sessionStorage for confirmation page (optional)
                sessionStorage.setItem('boardingDetails', JSON.stringify(boardingDetails));
                
                // Redirect to confirmation page
                window.location.href = 'b1.html';
            } catch (error) {
                console.error('Error saving boarding:', error);
                alert('Failed to save boarding. Please try again.');
            }
        });
    }
    
    // Set minimum dates for the date inputs
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    
    if (checkInInput && checkOutInput) {
        const formatDate = date => {
            const d = new Date(date);
            let month = '' + (d.getMonth() + 1);
            let day = '' + d.getDate();
            const year = d.getFullYear();
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            return [year, month, day].join('-');
        };
        
        checkInInput.min = formatDate(today);
        
        checkInInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const nextDay = new Date(selectedDate);
            nextDay.setDate(nextDay.getDate() + 1);
            checkOutInput.min = formatDate(nextDay);
            if (new Date(checkOutInput.value) <= selectedDate) {
                checkOutInput.value = formatDate(nextDay);
            }
        });
        
        checkOutInput.min = formatDate(tomorrow);
    }
    
    // Gallery lightbox functionality (unchanged)
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(image => {
        image.addEventListener('click', function() {
            const lightbox = document.createElement('div');
            lightbox.classList.add('lightbox');
            const lightboxContent = document.createElement('div');
            lightboxContent.classList.add('lightbox-content');
            const lightboxImage = document.createElement('img');
            lightboxImage.src = this.src;
            lightboxImage.alt = this.alt;
            const closeButton = document.createElement('span');
            closeButton.innerHTML = '×';
            closeButton.classList.add('close-lightbox');
            lightboxContent.appendChild(closeButton);
            lightboxContent.appendChild(lightboxImage);
            lightbox.appendChild(lightboxContent);
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            closeButton.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) closeLightbox();
            });
            function closeLightbox() {
                document.body.removeChild(lightbox);
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Newsletter form submission (unchanged)
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            if (email) {
                alert(`Thank you for subscribing with ${email}! You will receive our updates soon.`);
                emailInput.value = '';
            }
        });
    }
    
    // Sticky navbar effect (unchanged)
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }
    
    // Service card hover effects (unchanged)
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('service-card-hover');
        });
        card.addEventListener('mouseleave', function() {
            this.classList.remove('service-card-hover');
        });
    });
    
    // Add animation to elements when they enter viewport (unchanged)
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.section-content');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            if (elementPosition < screenPosition) {
                element.classList.add('animate-fade-in');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});