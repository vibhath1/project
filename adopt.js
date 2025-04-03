document.addEventListener('DOMContentLoaded', function() {
    const petsGrid = document.getElementById('petsGrid');
    // const petTypeRadios = document.getElementsByName('petType'); // Keep if used elsewhere, otherwise can be removed if only used in filterPets
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
            location: 'Kochi, KL', // Example location
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
        2: {
           "name": "Luna",
           "breed": "German Shepherd",
           "age": "1 year",
           "gender": "Female",
           "location": "Thrissur, KL", // Example location
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
           "name": "Thrissur Pet Rescue",
           "phone": "(555) 876-5432",
           "email": "adopt@thrissuranrescue.org",
           "hours": "9:00 AM - 5:00 PM",
           "location": "78 Rescue Lane,Thrissur, KL"
           }
       },
       
        3: {
            name: 'Milo', // From HTML
            breed: 'Siamese', // From HTML
            age: '1.5 years', // Approximated from HTML "1.5 years old"
            gender: 'Male', // From HTML
            location: 'Mumbai, MH', // From HTML
            image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80', // From HTML img src
            vaccinations: [
                // Add actual vaccination data for Milo
                { name: 'FVRCP', date: 'YYYY-MM-DD' },
                { name: 'Rabies', date: 'YYYY-MM-DD' }
            ],
            traits: ['Vocal', 'Affectionate', 'Playful', 'Intelligent'], // Add actual traits
            likes: ['Attention', 'Warm spots', 'Climbing'], // Add actual likes
            dislikes: ['Being ignored', 'Loud noises'], // Add actual dislikes
            biography: 'Milo is a typical Siamese - chatty, affectionate, and loves to be the center of attention. He enjoys playing and exploring high places.', // Add actual biography
            contact: {
               "name": "Mumbai Pet Shelter", // Example contact
               "phone": "(555) 111-2222",
               "email": "adopt@mumbaishelter.org",
               "hours": "10:00 AM - 4:00 PM",
               "location": "12 Shelter Road, Mumbai, MH"
            }
        },
        // --- ADD PET 4 DATA ---
        4: {
             name: 'Bella', // From HTML
             breed: 'Persian', // From HTML
             age: '3 years', // From HTML
             gender: 'Female', // From HTML
             location: 'Coimbatore, TN', // From HTML
             image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&q=80', // From HTML img src
             vaccinations: [
                 // Add actual vaccination data for Bella
                 { name: 'FVRCP', date: 'YYYY-MM-DD' },
                 { name: 'Rabies', date: 'YYYY-MM-DD' }
             ],
             traits: ['Calm', 'Gentle', 'Quiet', 'Likes routine'], // Add actual traits
             likes: ['Grooming', 'Napping', 'Quiet laps'], // Add actual likes
             dislikes: ['Sudden changes', 'Rough handling'], // Add actual dislikes
             biography: 'Bella is a sweet and gentle Persian cat looking for a calm home where she can relax and be pampered.', // Add actual biography
             contact: {
                "name": "Coimbatore Animal Friends", // Example contact
                "phone": "(555) 333-4444",
                "email": "adopt@coimbatorepets.org",
                "hours": "11:00 AM - 5:00 PM",
                "location": "45 Adoption Ave, Coimbatore, TN"
             }
         }
        // Add more pet data as needed
    };


    // --- MODIFICATION 1: Corrected cityOptions data format and content ---
    // City options by state - Ensure keys match state abbreviations in petData.location
    // Ensure city names here match city names used in petData.location for filtering
    const cityOptions = {
        'KL': ['Kochi', 'Thrissur'], // Corrected based on example petData
        'TN': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'], // Corrected format
        'KA': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi'],     // Corrected format
        'MH': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad']        // Corrected format
        // Add other states/cities corresponding to your pet data
    };

    // Update city options when state changes
    stateSelect.addEventListener('change', function() {
        const selectedState = this.value;
        const cities = cityOptions[selectedState] || []; // Get cities for the selected state

        // Clear previous options and add the default "Select City"
        citySelect.innerHTML = '<option value="">Select City</option>';

        // Add new city options
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
         // Optionally, disable city select if no state is chosen or state has no cities
        citySelect.disabled = !selectedState || cities.length === 0;
    });

     // Initialize city select state (optional, makes it disabled initially)
     citySelect.disabled = true;


    // Filter pets (ensure pet cards have data-type and .pet-location elements)
    function filterPets() {
        // Check if petsGrid exists before proceeding
        if (!petsGrid) {
            console.error("Element with ID 'petsGrid' not found.");
            return;
        }
        const selectedTypeInput = document.querySelector('input[name="petType"]:checked');
         if (!selectedTypeInput) {
             console.error("No pet type selected.");
             // Decide default behavior: maybe filter nothing or show all?
             // For now, let's assume 'all' if nothing is checked, though HTML should ensure one is.
             // selectedType = 'all';
             return; // Or handle default
         }
        const selectedType = selectedTypeInput.value;
        const selectedState = stateSelect.value;
        const selectedCity = citySelect.value;

        const petCards = petsGrid.querySelectorAll('.pet-card'); // Make sure your pet cards have this class

        petCards.forEach(card => {
            const petDataType = card.dataset.type; // Assumes pet card has data-type="dog" or data-type="cat"
            const locationElement = card.querySelector('.pet-location'); // Assumes pet card has an element with this class

            if (!locationElement) {
                console.warn("Pet card missing '.pet-location' element:", card);
                card.style.display = 'none'; // Hide card if essential info is missing
                return;
            }
            const locationText = locationElement.textContent; // e.g., "Kochi, KL"

            let showCard = true;

            // Filter by Type
            if (selectedType !== 'all' && petDataType !== selectedType) {
                showCard = false;
            }

            // Filter by State (check if state abbreviation is in the location text)
            // Ensure state values (e.g., 'KL') match the format in locationText
            if (showCard && selectedState && !locationText.includes(`, ${selectedState}`)) { // Added comma+space for more specific match
                 // Consider edge cases: What if location is just "KL"? Adjust logic if needed.
                 // A more robust way might be to store state/city separately in data attributes.
                 // Example: data-state="KL" data-city="Kochi"
                 // Then check: card.dataset.state !== selectedState
                showCard = false;
            }

            // Filter by City (check if city name is in the location text)
             // Ensure city values (e.g., 'Kochi') match the format in locationText
            if (showCard && selectedCity && !locationText.includes(selectedCity)) {
                // This simple includes might match partial city names (e.g., "Koch" if user types that)
                // A check like locationText.startsWith(selectedCity + ',') might be better if format is consistent.
                // Or again, use data-city attribute: card.dataset.city !== selectedCity
                showCard = false;
            }

            card.style.display = showCard ? 'block' : 'none'; // Use 'block' or appropriate display value (e.g., 'flex', 'grid')
        });
    }

    // Apply filters when button is clicked
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', filterPets);
    } else {
        console.error("Element with class '.apply-filters' not found.");
    }


    // --- MODIFICATION 2: Use Event Delegation for 'View Details' clicks ---
    if (petsGrid) {
        petsGrid.addEventListener('click', function(event) {
            // Find the closest ancestor element that matches '.view-details-button'
            const button = event.target.closest('.view-details-button');

            // If the click happened on or inside a button with that class...
            if (button) {
                const petId = button.dataset.petId; // Get petId from the button's data attribute
                if (!petId) {
                    console.error("'.view-details-button' clicked, but missing 'data-pet-id' attribute.", button);
                    return;
                }

                const pet = petData[petId];

                if (pet) {
                    // --- Start: Original modal population logic ---
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
                            <div>${new Date(vax.date).toLocaleDateString()}</div>
                        </div>
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
                    document.body.style.overflow = 'hidden'; // Prevent background scrolling

                    // Focus first interactive element in modal for accessibility
                    modal.querySelector('.modal-close').focus();
                    // --- End: Original modal population logic ---
                } else {
                    console.error("Pet data not found for ID:", petId); // Add error handling
                }
            }
        });
    } else {
         console.error("Element with ID 'petsGrid' not found, cannot attach 'View Details' listener.");
    }


    // --- Remaining code for Modal Closing, Form Submission, Validation ---

    // Handle modal close
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scrolling
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal if clicking outside the modal content
    if (modal) {
        modal.addEventListener('click', function(e) {
            // Check if the click is directly on the modal background (e.target)
            // not on its children (modal content)
            if (e.target === modal) {
                closeModal();
            }
        });
    }


    // Keyboard navigation (Escape key to close modal)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle contact form submission within the modal
    const contactForm = modal ? modal.querySelector('.contact-form') : null;
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent default form submission

            const submitButton = this.querySelector('.submit-button'); // Assumes a submit button with this class
            if (!submitButton) return; // Exit if button not found

            const originalText = submitButton.textContent;

            try {
                // Show loading state
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';

                // Simulate API call (replace with actual fetch in production)
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Show success message (using alert for simplicity)
                alert('Your message has been sent! The shelter will contact you soon.');
                this.reset(); // Clear the form fields
                closeModal(); // Close the modal on success

            } catch (error) {
                console.error('Error submitting contact form:', error);
                alert('An error occurred while sending your message. Please try again.');

            } finally {
                // Reset button state regardless of success or error
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });

        // --- Basic Form validation handling ---
        const formInputs = contactForm.querySelectorAll('input[required], textarea[required]'); // Target required fields
        formInputs.forEach(input => {
            // Visual feedback for invalid fields (can be enhanced with messages)
            input.addEventListener('invalid', function(e) {
                // Prevent browser's default validation popups if you want custom handling
                // e.preventDefault();
                this.classList.add('error'); // Add error class for styling
            });

            // Remove error styling when input becomes valid
            input.addEventListener('input', function() {
                if (this.validity.valid) {
                    this.classList.remove('error');
                }
                 // Add check on 'change' as well for some input types
            });
             input.addEventListener('change', function() {
                if (this.validity.valid) {
                    this.classList.remove('error');
                }
            });
        });

    } else if (modal) {
         console.warn("Element with class '.contact-form' not found inside the modal.");
    }

    // Initialize by filtering/displaying pets on page load
    // Make sure the HTML structure (pet cards) is ready or generated before calling this
    // If pets are loaded asynchronously, call filterPets() *after* they are added to the DOM.
    if (typeof generateInitialPetCards === 'function') {
         generateInitialPetCards(); // Call function to create cards if needed
    }
    filterPets();

}); // End DOMContentLoaded
