// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // --- DOM Element References ---
    const bookingForm = document.getElementById('groomingBookingForm'); // Use ID selector
    const bookedAppointmentsList = document.getElementById('bookedAppointmentsList');
    const noAppointmentsMessage = document.getElementById('noAppointmentsMessage');
    const bookingSuccessMessageDiv = document.getElementById('bookingSuccessMessage');
    const dateInput = document.getElementById('date');
    const serviceSelect = document.getElementById('service');
    const navbar = document.querySelector('.navbar');
    const STORAGE_KEY = 'pawsConnectBookings'; // Define localStorage key

    // --- Booking Form Handling ---
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Get form values
            const petNameInput = document.getElementById('petName');
            const serviceSelectInput = document.getElementById('service');
            const dateInput = document.getElementById('date');
            const timeSelectInput = document.getElementById('time');
            const notesInput = document.getElementById('notes');

            const petName = petNameInput.value.trim();
            const service = serviceSelectInput.value;
            const date = dateInput.value;
            const time = timeSelectInput.value;
            const notes = notesInput.value.trim();

            // Basic Validation (HTML required attributes handle most cases)
            if (!petName || !service || !date || !time) {
                // Although required attributes exist, keep a JS check as fallback
                alert('Please ensure all required fields (Pet Name, Service, Date, Time) are filled.');
                return;
            }

            // Create booking object with a unique ID
            const booking = {
                id: Date.now(), // Unique ID for cancellation
                petName,
                service, // Store service value ('basic', 'full', 'premium')
                date,
                time,
                notes,
                // timestamp: new Date().toISOString() // Optional: keep if needed
            };

            // Store booking
            saveBooking(booking);

            // Show confirmation message in the dedicated div
            showBookingConfirmation(booking);

            // Reset form
            bookingForm.reset();

            // Refresh the displayed bookings list
            loadAndDisplayBookings();

             // Scroll to the success message or booking list for visibility
            bookingSuccessMessageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // --- Booking Storage & Display ---

    // Function to save booking to localStorage
    function saveBooking(booking) {
        let existingBookings = getBookingsFromStorage();
        existingBookings.push(booking);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingBookings));
    }

    // Function to get bookings from localStorage
    function getBookingsFromStorage() {
        const bookingsJson = localStorage.getItem(STORAGE_KEY);
        try {
            return bookingsJson ? JSON.parse(bookingsJson) : [];
        } catch (e) {
            console.error("Error parsing bookings from localStorage:", e);
            return []; // Return empty array on error
        }
    }

    // Function to display booking confirmation message in the booking section
    function showBookingConfirmation(booking) {
        if (!bookingSuccessMessageDiv) return; // Exit if the div doesn't exist

        // Get service display name
        const serviceText = serviceSelect.options[serviceSelect.selectedIndex]?.text || booking.service; // Fallback to value

        bookingSuccessMessageDiv.innerHTML = `
            <strong>Booking Confirmed!</strong><br>
            Pet: ${booking.petName}<br>
            Service: ${serviceText}<br>
            Date: ${formatDate(booking.date)} at ${formatTime(booking.time)}
        `;
        bookingSuccessMessageDiv.style.display = 'block';

        // Optional: Hide the message after a few seconds
        setTimeout(() => {
            if (bookingSuccessMessageDiv) { // Check again in case the user navigated away
                 bookingSuccessMessageDiv.style.display = 'none';
                 bookingSuccessMessageDiv.innerHTML = ''; // Clear content
            }
        }, 5000); // Hide after 5 seconds
    }


    // Function to load and display all booked appointments
    function loadAndDisplayBookings() {
        if (!bookedAppointmentsList || !noAppointmentsMessage) return; // Exit if elements aren't found

        const bookings = getBookingsFromStorage();
        bookedAppointmentsList.innerHTML = ''; // Clear current list

        if (bookings.length === 0) {
            noAppointmentsMessage.style.display = 'block';
            bookedAppointmentsList.style.display = 'none'; // Hide the list container
        } else {
            noAppointmentsMessage.style.display = 'none';
            bookedAppointmentsList.style.display = 'grid'; // Ensure list container is visible (use grid as per CSS)

            // Sort bookings by date and time for better readability (optional)
            bookings.sort((a, b) => {
                const dateTimeA = new Date(`${a.date}T${a.time}`);
                const dateTimeB = new Date(`${b.date}T${b.time}`);
                return dateTimeA - dateTimeB;
            });


            bookings.forEach(booking => {
                // Find the display text for the service
                let serviceDisplayText = booking.service; // Default to stored value
                // Find the option in the select dropdown matching the stored service value
                const serviceOption = Array.from(serviceSelect.options).find(opt => opt.value === booking.service);
                if (serviceOption) {
                    serviceDisplayText = serviceOption.text; // Use the option's text
                }


                const card = document.createElement('div');
                card.classList.add('appointment-card');
                card.setAttribute('data-booking-id', booking.id); // Set data attribute for cancellation

                card.innerHTML = `
                    <div class="appointment-details">
                        <p><strong>Pet:</strong> ${escapeHTML(booking.petName)}</p>
                        <p><strong>Service:</strong> ${escapeHTML(serviceDisplayText)}</p>
                        <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
                        <p><strong>Time:</strong> ${formatTime(booking.time)}</p>
                        ${booking.notes ? `<p><strong>Notes:</strong> ${escapeHTML(booking.notes)}</p>` : ''}
                    </div>
                    <button class="cancel-button">Cancel Appointment</button>
                `;
                bookedAppointmentsList.appendChild(card);
            });
        }
    }

    // --- Booking Cancellation ---

    // Event delegation for cancel buttons
    if (bookedAppointmentsList) {
        bookedAppointmentsList.addEventListener('click', function(event) {
            if (event.target.classList.contains('cancel-button')) {
                const card = event.target.closest('.appointment-card');
                if (card) {
                    const bookingId = parseInt(card.getAttribute('data-booking-id'), 10); // Ensure it's a number
                    if (!isNaN(bookingId)) {
                        cancelBooking(bookingId);
                    } else {
                        console.error("Invalid booking ID found:", card.getAttribute('data-booking-id'));
                    }
                }
            }
        });
    }

    // Function to cancel a booking
    function cancelBooking(bookingId) {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            let bookings = getBookingsFromStorage();
            // Filter out the booking with the matching ID
            const updatedBookings = bookings.filter(booking => booking.id !== bookingId);

            // Save the updated list back to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookings));

            // Refresh the displayed list
            loadAndDisplayBookings();

            alert('Appointment cancelled successfully.'); // Provide feedback
        }
    }

    // --- Utility Functions ---

    // Format date for display
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        // Add time component to avoid timezone issues with toLocaleDateString
        const date = new Date(dateString + 'T00:00:00');
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    // Format time for display (Handles 24hr input)
    function formatTime(timeString) {
        if (!timeString) return 'N/A';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const minute = minutes || '00'; // Default to 00 if minutes are missing

        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM/PM

        // Pad minutes with leading zero if needed
        const paddedMinute = minute.padStart(2,'0');

        return `${hour12}:${paddedMinute} ${ampm}`;
    }

     // Simple HTML escaping function to prevent XSS
     function escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
     }


    // --- Initial Setup ---

    // Initialize date picker minimum date
    if (dateInput) {
        const today = new Date();
        // Adjust for local timezone offset before formatting
        today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
        const formattedToday = today.toISOString().split('T')[0];
        dateInput.setAttribute('min', formattedToday);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Ignore empty hrefs

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate offset dynamically based on navbar height if it exists
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const offset = 20; // Extra space above the section

                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight - offset, // Adjust for fixed navbar and extra space
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle navigation bar scrolling effect
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) { // Trigger earlier
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        // Initial check in case the page is loaded already scrolled down
        if (window.scrollY > 50) {
             navbar.classList.add('scrolled');
        }
    }

    // Initial load of bookings when the page is ready
    loadAndDisplayBookings();

}); // End DOMContentLoaded