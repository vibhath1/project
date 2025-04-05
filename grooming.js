// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // --- DOM Element References ---
    const bookingForm = document.getElementById('groomingBookingForm');
    const bookedAppointmentsList = document.getElementById('bookedAppointmentsList');
    const noAppointmentsMessage = document.getElementById('noAppointmentsMessage');
    const bookingSuccessMessageDiv = document.getElementById('bookingSuccessMessage');
    const dateInput = document.getElementById('date');
    const serviceSelect = document.getElementById('service');
    const navbar = document.querySelector('.navbar');

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
                alert('Please ensure all required fields (Pet Name, Service, Date, Time) are filled.');
                return;
            }

            // Create booking object with a unique ID
            const booking = {
                id: Date.now(),
                petName,
                service,
                date,
                time,
                notes
            };

            // Store booking via API
            saveBooking(booking);

            // Show confirmation message in the dedicated div
            showBookingConfirmation(booking);

            // Reset form
            bookingForm.reset();

            // Refresh the displayed bookings list
            loadAndDisplayBookings();

            // Scroll to the success message for visibility
            bookingSuccessMessageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // --- Booking Storage & Display ---

    // Function to save booking via API
    async function saveBooking(booking) {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(booking)
            });
            if (!response.ok) {
                throw new Error('Failed to save booking');
            }
            const savedBooking = await response.json();
            // No need to manually update local list since loadAndDisplayBookings fetches fresh data
        } catch (error) {
            console.error('Error saving booking:', error);
            alert('Failed to save booking. Please try again.');
        }
    }

    // Function to get bookings from API
    async function getBookingsFromStorage() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/bookings');
            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return [];
        }
    }

    // Function to display booking confirmation message
    function showBookingConfirmation(booking) {
        if (!bookingSuccessMessageDiv) return;

        const serviceText = serviceSelect.options[serviceSelect.selectedIndex]?.text || booking.service;

        bookingSuccessMessageDiv.innerHTML = `
            <strong>Booking Confirmed!</strong><br>
            Pet: ${booking.petName}<br>
            Service: ${serviceText}<br>
            Date: ${formatDate(booking.date)} at ${formatTime(booking.time)}
        `;
        bookingSuccessMessageDiv.style.display = 'block';

        setTimeout(() => {
            if (bookingSuccessMessageDiv) {
                bookingSuccessMessageDiv.style.display = 'none';
                bookingSuccessMessageDiv.innerHTML = '';
            }
        }, 5000);
    }

    // Function to load and display all booked appointments
    async function loadAndDisplayBookings() {
        if (!bookedAppointmentsList || !noAppointmentsMessage) return;

        const bookings = await getBookingsFromStorage();
        bookedAppointmentsList.innerHTML = '';

        if (bookings.length === 0) {
            noAppointmentsMessage.style.display = 'block';
            bookedAppointmentsList.style.display = 'none';
        } else {
            noAppointmentsMessage.style.display = 'none';
            bookedAppointmentsList.style.display = 'grid';

            bookings.sort((a, b) => {
                const dateTimeA = new Date(`${a.date}T${a.time}`);
                const dateTimeB = new Date(`${b.date}T${b.time}`);
                return dateTimeA - dateTimeB;
            });

            bookings.forEach(booking => {
                let serviceDisplayText = booking.service;
                const serviceOption = Array.from(serviceSelect.options).find(opt => opt.value === booking.service);
                if (serviceOption) {
                    serviceDisplayText = serviceOption.text;
                }

                const card = document.createElement('div');
                card.classList.add('appointment-card');
                card.setAttribute('data-booking-id', booking.id);

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

    if (bookedAppointmentsList) {
        bookedAppointmentsList.addEventListener('click', function(event) {
            if (event.target.classList.contains('cancel-button')) {
                const card = event.target.closest('.appointment-card');
                if (card) {
                    const bookingId = parseInt(card.getAttribute('data-booking-id'), 10);
                    if (!isNaN(bookingId)) {
                        cancelBooking(bookingId);
                    } else {
                        console.error("Invalid booking ID found:", card.getAttribute('data-booking-id'));
                    }
                }
            }
        });
    }

    // Function to cancel a booking via API
    async function cancelBooking(bookingId) {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/bookings/${bookingId}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error('Failed to cancel booking');
                }
                const data = await response.json();
                alert(data.message);
                await loadAndDisplayBookings(); // Refresh the list after cancellation
            } catch (error) {
                console.error('Error cancelling booking:', error);
                alert('Failed to cancel booking. Please try again.');
            }
        }
    }

    // --- Utility Functions ---

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString + 'T00:00:00');
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    function formatTime(timeString) {
        if (!timeString) return 'N/A';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const minute = minutes || '00';
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        const paddedMinute = minute.padStart(2, '0');
        return `${hour12}:${paddedMinute} ${ampm}`;
    }

    function escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    // --- Initial Setup ---

    if (dateInput) {
        const today = new Date();
        today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
        const formattedToday = today.toISOString().split('T')[0];
        dateInput.setAttribute('min', formattedToday);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const offset = 20;
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        }
    }

    // Initial load of bookings
    loadAndDisplayBookings();

}); // End DOMContentLoaded