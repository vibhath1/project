document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('consultationForm');
    const steps = document.querySelectorAll('.form-step');
    const progressBar = document.getElementById('formProgress');
    const stepIndicators = document.querySelectorAll('.step');
    const successAnimation = document.getElementById('successAnimation');
    const vetList = document.getElementById('vetList');
    const viewHistoryLink = document.getElementById('viewHistory');
    const historySection = document.getElementById('consultation-history');
    const historyList = document.getElementById('history-list');
    const consultationForm = document.querySelector('.form-wrapper');

    // Sample vet data (could be fetched from backend if dynamic)
    const vets = [
        { id: 1, name: 'Dr. Sarah Johnson', credentials: 'DVM, DACVIM', clinic: 'Pawsome Pet Care Center', location: 'Downtown Pet Hospital', fee: '$75', availability: ['9:00 AM', '11:00 AM', '2:00 PM'] },
        { id: 2, name: 'Dr. Michael Chen', credentials: 'DVM, DABVP', clinic: 'Happy Tails Veterinary Clinic', location: 'Sunset Pet Care', fee: '$85', availability: ['10:00 AM', '1:00 PM', '4:00 PM'] },
        { id: 3, name: 'Dr. Emily Rodriguez', credentials: 'DVM, CVA', clinic: 'Healing Paws Animal Hospital', location: 'Valley View Vet Center', fee: '$70', availability: ['9:30 AM', '12:00 PM', '3:30 PM'] }
    ];

    let currentStep = 1;
    let selectedVet = null;

    // Update progress bar
    function updateProgress() {
        const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
        progressBar.style.width = `${progress}%`;

        stepIndicators.forEach((step, index) => {
            if (index + 1 < currentStep) {
                step.classList.add('complete');
                step.classList.add('active');
            } else if (index + 1 === currentStep) {
                step.classList.remove('complete');
                step.classList.add('active');
            } else {
                step.classList.remove('complete', 'active');
            }
        });
    }

    // Show step
    function showStep(stepNumber) {
        steps.forEach(step => step.classList.add('hidden'));
        document.getElementById(`step${stepNumber}`).classList.remove('hidden');
        currentStep = stepNumber;
        updateProgress();

        if (stepNumber === 3) {
            populateVetList();
        }
    }

    // Populate vet list
    function populateVetList() {
        vetList.innerHTML = vets.map(vet => `
            <div class="vet-card" data-vet-id="${vet.id}">
                <h3 class="vet-name">${vet.name}</h3>
                <p class="vet-credentials">${vet.credentials}</p>
                <p class="vet-clinic">${vet.clinic}</p>
                <p class="vet-location">${vet.location}</p>
                <p class="consultation-fee">Consultation Fee: ${vet.fee}</p>
                <div class="availability">
                    <p>Available slots:</p>
                    <select class="time-select">
                        ${vet.availability.map(time => `<option value="${time}">${time}</option>`).join('')}
                    </select>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.vet-card').forEach(card => {
            card.addEventListener('click', function() {
                document.querySelectorAll('.vet-card').forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
                selectedVet = parseInt(this.dataset.vetId);
            });
        });
    }

    // Handle next button clicks
    document.querySelectorAll('.next-button').forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = parseInt(this.dataset.next);
            if (validateStep(currentStep)) {
                showStep(nextStep);
            }
        });
    });

    // Handle back button clicks
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.dataset.back);
            showStep(prevStep);
        });
    });

    // Validate step
    function validateStep(step) {
        const currentStepElement = document.getElementById(`step${step}`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    // View history link click handler
    viewHistoryLink.addEventListener('click', function(e) {
        e.preventDefault();
        showHistory();
    });

    // Show history section
    function showHistory() {
        consultationForm.classList.add('hidden');
        historySection.classList.remove('hidden');
        populateHistoryList();
    }

    // Show consultation form
    window.showConsultationForm = function() {
        historySection.classList.add('hidden');
        consultationForm.classList.remove('hidden');
        showStep(1);
    }

    // Populate history list from API
    async function populateHistoryList() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/consultations');
            if (!response.ok) throw new Error('Failed to fetch consultation history');
            const consultationHistory = await response.json();

            if (consultationHistory.length === 0) {
                historyList.innerHTML = `
                    <div class="empty-history">
                        <i class="fas fa-calendar-check"></i>
                        <p>No consultations found. Schedule your first consultation!</p>
                    </div>
                `;
                return;
            }

            historyList.innerHTML = consultationHistory.map(consult => `
                <div class="history-item" data-id="${consult.id}">
                    <h3>Consultation with ${consult.vetName}</h3>
                    <p><strong>Pet:</strong> ${consult.petType}, ${consult.petAge} years old</p>
                    <p><strong>Symptoms:</strong> ${consult.symptoms}</p>
                    <p><strong>Scheduled for:</strong> ${consult.consultDate} at ${consult.timeSlot}</p>
                    <p><strong>Status:</strong> <span class="status status-${consult.status}">${consult.status}</span></p>
                    ${consult.status === 'scheduled' ? `<button class="cancel-btn" data-id="${consult.id}">Cancel Consultation</button>` : ''}
                </div>
            `).join('');

            // Add cancel button handlers
            document.querySelectorAll('.cancel-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const id = parseInt(this.dataset.id);
                    cancelConsultation(id);
                });
            });
        } catch (error) {
            console.error('Error fetching history:', error);
            historyList.innerHTML = `<p>Failed to load history: ${error.message}</p>`;
        }
    }

    // Cancel a consultation via API
    async function cancelConsultation(id) {
        if (confirm('Are you sure you want to cancel this consultation?')) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/consultations/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error('Failed to cancel consultation');
                const data = await response.json();
                alert(data.message);
                populateHistoryList(); // Refresh the list
            } catch (error) {
                console.error('Error cancelling consultation:', error);
                alert(`Failed to cancel consultation: ${error.message}`);
            }
        }
    }

    // Handle form submission via API
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!selectedVet) {
            alert('Please select a veterinarian');
            return;
        }

        const submitButton = document.querySelector('.submit-button');
        submitButton.disabled = true;
        submitButton.textContent = 'Scheduling...';

        try {
            const formData = new FormData(form);
            const vet = vets.find(v => v.id === selectedVet);
            const vetCard = document.querySelector(`.vet-card[data-vet-id="${selectedVet}"]`);
            const selectedTime = vetCard ? vetCard.querySelector('.time-select').value : '';

            const consultation = {
                id: Date.now(),
                vetId: selectedVet,
                vetName: vet.name,
                petType: formData.get('petType'),
                petAge: parseInt(formData.get('petAge')),
                symptoms: formData.get('symptoms'),
                consultDate: formData.get('consultDate'),
                timeSlot: selectedTime, // Use selected time from vet availability
                status: 'scheduled'
            };

            const response = await fetch('http://127.0.0.1:5000/api/consultations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(consultation)
            });
            if (!response.ok) throw new Error('Failed to schedule consultation');
            await response.json(); // Get the saved consultation

            // Show success animation
            successAnimation.classList.remove('hidden');

            // Reset form
            form.reset();
            showStep(1);
            selectedVet = null;

        } catch (error) {
            console.error('Error:', error);
            alert(`An error occurred: ${error.message}. Please try again.`);

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Schedule Consultation';
        }
    });

    // Close success animation
    document.querySelector('.close-button').addEventListener('click', function() {
        successAnimation.classList.add('hidden');
    });

    // Initialize form
    updateProgress();
    showStep(1);
});