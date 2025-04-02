document.addEventListener('DOMContentLoaded', function() {
    const petsGrid = document.getElementById('petsGrid');
    const petTypeRadios = document.getElementsByName('petType');
    const stateSelect = document.getElementById('stateSelect');
    const citySelect = document.getElementById('citySelect');
    const applyFiltersBtn = document.querySelector('.apply-filters');
    const modal = document.getElementById('petModal');
    const modalClose = modal.querySelector('.modal-close');

    // Pet data (in production, this would come from an API)
    const petData = {
        1: {
            name: 'Max',
            breed: 'Golden Retriever',
            age: '2 years',
            gender: 'Male',
            location: 'Kochi, KL',
            image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80',
            vaccinations: [
                { name: 'Rabies', date: '2023-05-15' },
                { name: 'DHPP', date: '2023-04-20' },
                { name: 'Bordetella', date: '2023-06-01' }
            ],
            traits: ['Friendly', 'Energetic', 'Good with kids', 'Trained', 'Playful'],
            likes: ['Long walks', 'Playing fetch', 'Swimming', 'Car rides'],
            dislikes: ['Being alone', 'Thunderstorms', 'Vacuum cleaners'],
            biography: 'Max is a loving and energetic Golden Retriever who brings joy to everyone he meets. He\'s well-trained, great with children, and loves outdoor activities. Despite his boundless energy, he\'s also content to cuddle on the couch after a day of play. Max would thrive in an active family that can give him plenty of exercise and attention.',
            contact: {
           "name": "Kochi Pet Rescue",
           "phone": "(555) 876-5432",
           "email": "adopt@kochirescue.org",
           "hours": "9:00 AM - 5:00 PM",
           "location": "78 Rescue Lane, Kochi, KL"
            }
        },
        2:{
           "name": "Luna",
           "breed": "German Shepherd",
           "age": "1 year",
           "gender": "Female",
           "location": "Thiruvananthapuram, KL",
           "image": "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&q=80",
           "vaccinations": [
            { "name": "Rabies", "date": "2024-01-10" },
            { "name": "DHPP", "date": "2023-12-15" },
            { "name": "Leptospirosis", "date": "2024-02-05" }
            ],
           "traits": ["Loyal", "Protective", "Intelligent", "Trainable", "Energetic"],
           "likes": ["Running", "Training sessions", "Tug-of-war", "Playing in the park"],
           "dislikes": ["Loud noises", "Strangers at first", "Being left alone too long"],
           "biography": "Luna is a smart and devoted German Shepherd who loves to stay active and engaged. She is quick to learn new commands and enjoys playtime with her family. Though initially cautious around strangers, she quickly warms up and becomes affectionate. She would do best in a home that can provide consistent training and plenty of exercise.",
           "contact": {
           "name": "Trivandrum Pet Rescue",
           "phone": "(555) 876-5432",
           "email": "adopt@trivanrescue.org",
           "hours": "9:00 AM - 5:00 PM",
           "location": "78 Rescue Lane,Thiruvananthapuram, KL"
    }
}

        // Add more pet data as needed
    };

    // City options by state
    const cityOptions = {
        'KL': ['San Francisco', 'Los Angeles', 'San Diego', 'Sacramento'],
        'TN': ['Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem],
        'KA': ['Bengaluru, Mysuru, Mangaluru, Hubballi, Belagavi'],
        'MH': ['Mumbai, Pune, Nagpur, Nashik, Aurangabad']
    };

    // Update city options when state changes
    stateSelect.addEventListener('change', function() {
        const cities = cityOptions[this.value] || [];
        citySelect.innerHTML = '<option value="">Select City</option>' +
            cities.map(city => `<option value="${city}">${city}</option>`).join('');
    });

    // Filter pets
    function filterPets() {
        const selectedType = document.querySelector('input[name="petType"]:checked').value;
        const selectedState = stateSelect.value;
        const selectedCity = citySelect.value;

        const petCards = petsGrid.querySelectorAll('.pet-card');
        
        petCards.forEach(card => {
            const petType = card.dataset.type;
            const location = card.querySelector('.pet-location').textContent;
            
            let showCard = true;

            if (selectedType !== 'all' && petType !== selectedType) {
                showCard = false;
            }

            if (selectedState && !location.includes(selectedState)) {
                showCard = false;
            }

            if (selectedCity && !location.includes(selectedCity)) {
                showCard = false;
            }

            card.style.display = showCard ? 'block' : 'none';
        });
    }

    // Apply filters when button is clicked
    applyFiltersBtn.addEventListener('click', filterPets);

    // Handle view details button clicks
    document.querySelectorAll('.view-details-button').forEach(button => {
        button.addEventListener('click', function() {
            const petId = this.dataset.petId;
            const pet = petData[petId];
            
            if (pet) {
                // Populate modal with pet data
                modal.querySelector('.pet-profile-image').src = pet.image;
                modal.querySelector('#modalTitle').textContent = pet.name;
                modal.querySelector('.pet-profile-breed').textContent = pet.breed;
                modal.querySelector('.pet-profile-details').textContent = `${pet.age} • ${pet.gender}`;
                modal.querySelector('.pet-profile-location').textContent = pet.location;

                // Vaccinations
                const vaccinationList = modal.querySelector('.vaccination-list');
                vaccinationList.innerHTML = pet.vaccinations.map(vax => `
                    <div class="vaccination-item">
                        <strong>${vax.name}</strong>
                        <div>${new Date(vax.date).toLocaleDateString()}</div> </div>
                    `).join('');

                // Personality traits
                const personalityTraits = modal.querySelector('.personality-traits');
                personalityTraits.innerHTML = pet.traits.map(trait => `
                    <span class="trait-tag">${trait}</span>
                `).join('');

                // Biography
                modal.querySelector('.pet-biography').textContent = pet.biography;

                // Contact information
                modal.querySelector('.contact-phone').textContent = pet.contact.phone;
                modal.querySelector('.contact-email').textContent = pet.contact.email;
                modal.querySelector('.contact-time').textContent = pet.contact.hours;
                modal.querySelector('.contact-location').textContent = pet.contact.location;

                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';

                // Focus first interactive element
                modal.querySelector('.modal-close').focus();
            }
        });
    });

    // Handle modal close
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle contact form submission
    const contactForm = modal.querySelector('.contact-form');
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        
        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            alert('Your message has been sent! The shelter will contact you soon.');
            this.reset();
            closeModal();
            
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
            
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });

    // Form validation
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            this.classList.add('error');
        });

        input.addEventListener('input', function() {
            if (this.validity.valid) {
                this.classList.remove('error');
            }
        });
    });

    // Initialize with all pets shown
    filterPets();
});
