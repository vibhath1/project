document.addEventListener('DOMContentLoaded', async function() {
        const confirmationDiv = document.getElementById('confirmationDetails');
        
        try {
            const response = await fetch('http://127.0.0.1:5000/api/boardings');
            if (!response.ok) {
                throw new Error('Failed to fetch boarding details');
            }
            const boardings = await response.json();
            
            // Display the most recent boarding (assumes latest has the highest ID)
            if (boardings.length > 0) {
                const latestBoarding = boardings.sort((a, b) => b.id - a.id)[0];
                confirmationDiv.innerHTML = `
                    <p><strong>Pet Name:</strong> ${latestBoarding.petName}</p>
                    <p><strong>Package:</strong> ${latestBoarding.packageType.charAt(0).toUpperCase() + latestBoarding.packageType.slice(1)}</p>
                    <p><strong>Check-In:</strong> ${formatDate(latestBoarding.checkIn)}</p>
                    <p><strong>Check-Out:</strong> ${formatDate(latestBoarding.checkOut)}</p>
                    <p><strong>Special Needs:</strong> ${latestBoarding.specialNeeds || 'None'}</p>
                    <p><strong>Total Price:</strong> ₹${latestBoarding.totalPrice}</p>
                `;
            } else {
                confirmationDiv.innerHTML = '<p>No boarding bookings found.</p>';
            }
        } catch (error) {
            console.error('Error fetching boarding details:', error);
            confirmationDiv.innerHTML = '<p>Failed to load boarding details. Please try again later.</p>';
        }

        // Back button functionality
        document.getElementById('backButton').addEventListener('click', function() {
            window.location.href = 'index.html'; // Replace with your boarding page filename

        // Format date function
        function formatDate(dateString) {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString(undefined, options);
        }
    });
});