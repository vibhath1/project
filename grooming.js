// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Booking form submission handler
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const petName = document.getElementById('petName').value;
            const service = document.getElementById('service').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const notes = document.getElementById('notes').value;
            
            // Validate form
            if (!petName || !service || !date || !time) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Create booking object
            const booking = {
                petName,
                service,
                date,
                time,
                notes,
                timestamp: new Date().toISOString()
            };
            
            // Store booking in localStorage
            saveBooking(booking);
            
            // Show confirmation message
            showBookingConfirmation(booking);
            
            // Reset form
            bookingForm.reset();
        });
    }
    
    // Function to save booking to localStorage
    function saveBooking(booking) {
        let existingBookings = JSON.parse(localStorage.getItem('pawsConnectBookings')) || [];
        existingBookings.push(booking);
        localStorage.setItem('pawsConnectBookings', JSON.stringify(existingBookings));
    }
    
    // Function to display booking confirmation
    function showBookingConfirmation(booking) {
        // Get service name instead of value
        let serviceName = '';
        const serviceSelect = document.getElementById('service');
        const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
        if (selectedOption) {
            serviceName = selectedOption.text;
        }
        
        // Create modal or notification for confirmation
        const confirmationHTML = `
            <div class="booking-confirmation">
                <div class="confirmation-content">
                    <h3>Booking Confirmed!</h3>
                    <p>Thank you for booking with Paws Connect.</p>
                    <p><strong>Pet:</strong> ${booking.petName}</p>
                    <p><strong>Service:</strong> ${serviceName}</p>
                    <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
                    <p><strong>Time:</strong> ${formatTime(booking.time)}</p>
                    <button id="closeConfirmation" class="close-button">Close</button>
                </div>
            </div>
        `;
        
        // Insert confirmation into DOM
        const confirmationElement = document.createElement('div');
        confirmationElement.innerHTML = confirmationHTML;
        document.body.appendChild(confirmationElement.firstElementChild);
        
        // Add event listener to close button
        document.getElementById('closeConfirmation').addEventListener('click', function() {
            document.querySelector('.booking-confirmation').remove();
        });
    }
    
    // Format date for display
    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Format time for display
    function formatTime(timeString) {
        // Convert 24-hour time format to 12-hour format
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes || '00'} ${ampm}`;
    }
    
    // Initialize date picker with minimum date of today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1;
        let dd = today.getDate();
        
        if (mm < 10) mm = '0' + mm;
        if (dd < 10) dd = '0' + dd;
        
        const formattedToday = `${yyyy}-${mm}-${dd}`;
        dateInput.setAttribute('min', formattedToday);
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Dynamic pricing based on pet size (could be expanded in the future)
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        // This could be expanded to change prices based on pet size selection
        serviceSelect.addEventListener('change', function() {
            // Future enhancement: update displayed price based on selection
        });
    }
    
    // Handle navigation bar scrolling effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
});
