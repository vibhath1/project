document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('petRegistrationForm');
    const petTypeInputs = document.getElementsByName('petType');
    const breedSelect = document.getElementById('petBreed');
    const aggressionSlider = document.getElementById('aggressionLevel');
    const aggressionValue = document.getElementById('aggressionValue');
    const submitButton = document.getElementById('submitButton');
    const modal = document.getElementById('confirmationModal');
    const closeModalButton = document.querySelector('.close-modal');
    const petDetailsContent = document.getElementById('petDetailsContent');
    const vaccinationGroup = document.getElementById('vaccinationGroup');

    // Breed lists
    const breeds = {
        dog: [
            'Labrador Retriever', 'German Shepherd', 'Golden Retriever',
            'French Bulldog', 'Bulldog', 'Poodle', 'Beagle',
            'Rottweiler', 'Dachshund', 'Yorkshire Terrier'
        ],
        cat: [
            'Persian', 'Maine Coon', 'Siamese', 'British Shorthair',
            'Ragdoll', 'Bengal', 'Abyssinian', 'American Shorthair',
            'Scottish Fold', 'Sphynx'
        ]
    };

    // Vaccination lists
    const vaccinations = {
        dog: [
            'Rabies',
            'Distemper',
            'Parvovirus',
            'Hepatitis',
            'Bordetella'
        ],
        cat: [
            'Rabies',
            'Feline Distemper',
            'Feline Calicivirus',
            'Feline Herpesvirus',
            'Feline Leukemia'
        ]
    };

    // Update breeds based on pet type
    function updateBreeds(petType) {
        breedSelect.innerHTML = '<option value="">Select breed</option>';
        breeds[petType].forEach(breed => {
            const option = document.createElement('option');
            option.value = breed.toLowerCase().replace(/\s+/g, '-');
            option.textContent = breed;
            breedSelect.appendChild(option);
        });
    }

    // Update vaccinations based on pet type
    function updateVaccinations(petType) {
        vaccinationGroup.innerHTML = '';
        vaccinations[petType].forEach(vaccination => {
            const wrapper = document.createElement('label');
            wrapper.className = 'checkbox-wrapper';
            
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.name = 'vaccinations';
            input.value = vaccination.toLowerCase().replace(/\s+/g, '-');
            
            const span = document.createElement('span');
            span.className = 'checkbox-label';
            span.textContent = vaccination;
            
            wrapper.appendChild(input);
            wrapper.appendChild(span);
            vaccinationGroup.appendChild(wrapper);
        });
    }

    // Initialize breeds and vaccinations
    updateBreeds('dog');
    updateVaccinations('dog');

    // Update breeds and vaccinations when pet type changes
    petTypeInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateBreeds(this.value);
            updateVaccinations(this.value);
        });
    });

    // Update aggression slider value
    aggressionSlider.addEventListener('input', function() {
        aggressionValue.textContent = this.value;
    });

    // Form validation
    function validateForm() {
        let isValid = true;
        const errors = {};

        // Pet name validation
        const petName = form.petName.value.trim();
        if (!petName) {
            errors.petName = 'Pet name is required';
            isValid = false;
        } else if (petName.length < 2) {
            errors.petName = 'Pet name must be at least 2 characters long';
            isValid = false;
        }

        // Breed validation
        if (!form.petBreed.value) {
            errors.petBreed = 'Please select a breed';
            isValid = false;
        }

        // Age validation
        const age = parseFloat(form.petAge.value);
        if (isNaN(age) || age < 0.5 || age > 20) {
            errors.petAge = 'Please enter a valid age between 0.5 and 20 years';
            isValid = false;
        }

        // Vaccination validation
        const vaccinations = form.querySelectorAll('input[name="vaccinations"]:checked');
        if (vaccinations.length === 0) {
            errors.vaccinations = 'Please select at least one vaccination';
            isValid = false;
        }

        // Display errors
        Object.keys(errors).forEach(field => {
            const errorElement = document.querySelector(`[data-error="${field}"]`);
            if (errorElement) {
                errorElement.textContent = errors[field];
                const input = form.querySelector(`[name="${field}"]`);
                if (input) {
                    input.classList.add('error');
                }
            }
        });

        return isValid;
    }

    // Clear errors when input changes
    form.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorElement = document.querySelector(`[data-error="${this.name}"]`);
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitButton.querySelector('.button-text').classList.add('hidden');
        submitButton.querySelector('.button-loader').classList.remove('hidden');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Get selected vaccinations
            const selectedVaccinations = Array.from(form.querySelectorAll('input[name="vaccinations"]:checked'))
                .map(input => input.nextElementSibling.textContent);

            // Create pet details HTML
            const petDetails = `
                <div class="pet-details-grid">
                    <p><strong>Name:</strong> ${form.petName.value}</p>
                    <p><strong>Type:</strong> ${form.petType.value}</p>
                    <p><strong>Breed:</strong> ${breedSelect.options[breedSelect.selectedIndex].text}</p>
                    <p><strong>Age:</strong> ${form.petAge.value} years</p>
                    <p><strong>Gender:</strong> ${form.petGender.value}</p>
                    <p><strong>Aggression Level:</strong> ${form.aggressionLevel.value}/10</p>
                    <p><strong>Vaccinations:</strong> ${selectedVaccinations.join(', ')}</p>
                </div>
            `;

            // Update and show modal
            petDetailsContent.innerHTML = petDetails;
            modal.classList.add('active');

            // Reset form
            form.reset();
            updateBreeds('dog');
            updateVaccinations('dog');
            aggressionValue.textContent = '5';

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.querySelector('.button-text').classList.remove('hidden');
            submitButton.querySelector('.button-loader').classList.add('hidden');
        }
    });

    // Close modal
    closeModalButton.addEventListener('click', function() {
        modal.classList.remove('active');
    });

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Handle "Escape" key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
});