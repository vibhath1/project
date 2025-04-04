// DOM Elements
        const registerViewBtn = document.getElementById('registerViewBtn');
        const myPetsViewBtn = document.getElementById('myPetsViewBtn');
        const howItWorksBtn = document.getElementById('howItWorksBtn');
        const contactBtn = document.getElementById('contactBtn');

        const registerSection = document.getElementById('registerSection');
        const myPetsSection = document.getElementById('myPetsSection');
        const petListContainer = document.getElementById('petList');
        const noPetsMessage = document.getElementById('noPetsMessage');

        const petForm = document.getElementById('petForm');
        const petNameInput = document.getElementById('petName');
        const petSpeciesInput = document.getElementById('petSpecies');
        const petBreedInput = document.getElementById('petBreed');
        const petAgeInput = document.getElementById('petAge');
        const vaccinationStatusInput = document.getElementById('vaccinationStatus');
        const aggressionLevelInput = document.getElementById('aggressionLevel');
        const petImageInput = document.getElementById('petImage');
        const uploadStatus = document.getElementById('uploadStatus');
        const fileInputLabel = document.querySelector('.file-input-label');

        // Data Store
        let registeredPets = [];

        // --- Functions ---

        function setActiveView(viewToShow) {
            registerSection.classList.remove('active');
            myPetsSection.classList.remove('active');
            registerViewBtn.classList.remove('active');
            myPetsViewBtn.classList.remove('active');

            // Ensure sections reset animation properties for re-entry
            registerSection.style.animation = 'none';
            myPetsSection.style.animation = 'none';
            // Trigger reflow to reset animation
            registerSection.offsetHeight;
            myPetsSection.offsetHeight;
            registerSection.style.animation = '';
            myPetsSection.style.animation = '';


            if (viewToShow === 'register') {
                registerSection.classList.add('active');
                registerViewBtn.classList.add('active');
            } else if (viewToShow === 'myPets') {
                displayPets();
                myPetsSection.classList.add('active');
                myPetsViewBtn.classList.add('active');
            }
        }

        function displayPets() {
            petListContainer.innerHTML = '';

            if (registeredPets.length === 0) {
                noPetsMessage.style.display = 'block';
            } else {
                noPetsMessage.style.display = 'none';
                registeredPets.forEach((pet, index) => {
                    const petItem = document.createElement('div');
                    petItem.classList.add('pet-item');
                    petItem.setAttribute('data-id', pet.id);

                    const imageName = pet.imageName ? (pet.imageName.length > 20 ? pet.imageName.substring(0, 17) + '...' : pet.imageName) : 'No image';

                    petItem.innerHTML = `
                        <div class="pet-details">
                            <span><strong>Name:</strong> ${pet.name}</span>
                            <span><strong>Species:</strong> ${pet.species}</span>
                            <span><strong>Breed:</strong> ${pet.breed}</span>
                            <span><strong>Age:</strong> ${pet.age} years</span>
                            <span><strong>Vaccinated:</strong> ${pet.vaccination}</span>
                            <span><strong>Aggression:</strong> ${pet.aggression}</span>
                            <span><strong>Image:</strong> ${imageName}</span>
                        </div>
                        <button class="delete-pet-btn">Delete</button>
                    `;
                     petItem.style.animationDelay = `${index * 0.08}s`; // Slightly faster stagger

                    petListContainer.appendChild(petItem);
                });
            }
        }

        function deletePet(petId) {
             const petIndex = registeredPets.findIndex(pet => pet.id === petId);
             if (petIndex > -1) {
                 // Add a class to trigger removal animation (optional)
                 const itemToRemove = petListContainer.querySelector(`.pet-item[data-id="${petId}"]`);
                 if (itemToRemove) {
                    // Example: fade out before removing
                    itemToRemove.style.transition = 'opacity 0.3s ease-out';
                    itemToRemove.style.opacity = '0';
                    // Wait for animation to finish before removing from array and DOM
                    setTimeout(() => {
                        registeredPets.splice(petIndex, 1);
                        displayPets(); // Re-render the list (or just remove the item directly)
                    }, 300); // Match timeout to transition duration
                 } else {
                     // Fallback if animation fails
                     registeredPets.splice(petIndex, 1);
                     displayPets();
                 }

            } else {
                console.error("Could not find pet with ID:", petId);
            }
            // updateLocalStorage(); // Update if using localStorage
        }

        // function updateLocalStorage() {
        //    localStorage.setItem('registeredPets', JSON.stringify(registeredPets));
        // }

        // function loadFromLocalStorage() {
        //     const storedPets = localStorage.getItem('registeredPets');
        //     if (storedPets) {
        //         registeredPets = JSON.parse(storedPets);
        //     }
        // }


        // --- Event Listeners ---

        registerViewBtn.addEventListener('click', () => setActiveView('register'));
        myPetsViewBtn.addEventListener('click', () => setActiveView('myPets'));

        howItWorksBtn.addEventListener('click', () => {
            alert("How It Works:\n1. Register your pet with its details.\n2. Browse potential matches (feature coming soon!).\n3. Connect safely with other pet owners.\n4. View and manage your registered pets in 'My Pets'.");
        });

        contactBtn.addEventListener('click', () => {
            alert("Contact Us:\nEmail: support@pawsconnect.example.com\nPhone: 123-456-7890 (Example)"); // Updated email
        });

        petImageInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                const fileName = this.files[0].name;
                uploadStatus.innerText = `Selected: ${fileName.length > 30 ? fileName.substring(0, 27) + '...' : fileName}`; // Truncate long names
                uploadStatus.style.color = 'var(--success-color)';
                fileInputLabel.textContent = 'Change Image';
            } else {
                uploadStatus.innerText = '';
                fileInputLabel.textContent = 'Choose Image';
            }
        });

        petForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const petName = petNameInput.value.trim();
            const petSpecies = petSpeciesInput.value;
            const petBreed = petBreedInput.value.trim();
            const petAge = petAgeInput.value;
            const vaccinationStatus = vaccinationStatusInput.value;
            const aggressionLevel = aggressionLevelInput.value;
            const petImageFile = petImageInput.files[0];

            if (petName && petSpecies && petBreed && petAge && vaccinationStatus && aggressionLevel) {
                 const newPetId = Date.now();
                 const newPet = {
                    id: newPetId,
                    name: petName,
                    species: petSpecies,
                    breed: petBreed,
                    age: petAge,
                    vaccination: vaccinationStatus,
                    aggression: aggressionLevel,
                    imageName: petImageFile ? petImageFile.name : null
                };
                registeredPets.push(newPet);
                // updateLocalStorage(); // Update if using localStorage

                alert(`${petName} registered successfully!`);
                petForm.reset();
                uploadStatus.innerText = '';
                fileInputLabel.textContent = 'Choose Image';
                setActiveView('myPets');
            } else {
                alert("Please fill in all required fields.");
            }
        });

        petListContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('delete-pet-btn')) {
                const petItem = event.target.closest('.pet-item');
                if (petItem) {
                    const petId = parseInt(petItem.getAttribute('data-id'), 10);
                     if (!isNaN(petId)) {
                         if (confirm("Are you sure you want to delete this pet?")) {
                            deletePet(petId);
                         }
                    } else {
                         console.error("Invalid Pet ID found on element:", petItem);
                    }
                }
            }
        });

        document.getElementById('currentYear').textContent = new Date().getFullYear();

        // --- Initial Setup ---
        // loadFromLocalStorage(); // Load if using localStorage
        setActiveView('register');
