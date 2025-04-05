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

// Base URL for Flask server
const FLASK_BASE_URL = 'http://127.0.0.1:5000';

// --- Functions ---

function setActiveView(viewToShow) {
    registerSection.classList.remove('active');
    myPetsSection.classList.remove('active');
    registerViewBtn.classList.remove('active');
    myPetsViewBtn.classList.remove('active');

    registerSection.style.animation = 'none';
    myPetsSection.style.animation = 'none';
    registerSection.offsetHeight; // Trigger reflow
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

async function displayPets() {
    petListContainer.innerHTML = '';

    try {
        const response = await fetch(`${FLASK_BASE_URL}/api/petm`);
        if (!response.ok) throw new Error('Failed to fetch pets');
        const registeredPets = await response.json();

        if (registeredPets.length === 0) {
            noPetsMessage.style.display = 'block';
        } else {
            noPetsMessage.style.display = 'none';
            registeredPets.forEach((pet, index) => {
                const petItem = document.createElement('div');
                petItem.classList.add('pet-item');
                petItem.setAttribute('data-id', pet.id);

                const imageName = pet.imageName ? (pet.imageName.length > 20 ? pet.imageName.substring(0, 17) + '...' : pet.imageName) : 'No image';
                const imageUrl = pet.imageName ? `${FLASK_BASE_URL}/static/uploads/${pet.imageName}` : null;

                petItem.innerHTML = `
                    <div class="pet-details">
                        ${imageUrl ? `<img src="${imageUrl}" alt="${pet.name}" class="pet-image" style="max-width: 100px; max-height: 100px;">` : ''}
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
                petItem.style.animationDelay = `${index * 0.08}s`;
                petListContainer.appendChild(petItem);
            });
        }
    } catch (error) {
        console.error('Error fetching pets:', error);
        petListContainer.innerHTML = `<p>Failed to load pets: ${error.message}</p>`;
    }
}

async function deletePet(petId) {
    if (confirm("Are you sure you want to delete this pet?")) {
        try {
            const response = await fetch(`${FLASK_BASE_URL}/api/petm/${petId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete pet');
            const data = await response.json();

            const itemToRemove = petListContainer.querySelector(`.pet-item[data-id="${petId}"]`);
            if (itemToRemove) {
                itemToRemove.style.transition = 'opacity 0.3s ease-out';
                itemToRemove.style.opacity = '0';
                setTimeout(() => displayPets(), 300);
            } else {
                displayPets();
            }
            alert(data.message);
        } catch (error) {
            console.error('Error deleting pet:', error);
            alert(`Failed to delete pet: ${error.message}`);
        }
    }
}

// --- Event Listeners ---

registerViewBtn.addEventListener('click', () => setActiveView('register'));
myPetsViewBtn.addEventListener('click', () => setActiveView('myPets'));

howItWorksBtn.addEventListener('click', () => {
    alert("How It Works:\n1. Register your pet with its details.\n2. Browse potential matches (feature coming soon!).\n3. Connect safely with other pet owners.\n4. View and manage your registered pets in 'My Pets'.");
});

contactBtn.addEventListener('click', () => {
    alert("Contact Us:\nEmail: support@pawsconnect.example.com\nPhone: 123-456-7890 (Example)");
});

petImageInput.addEventListener('change', function() {
    if (this.files.length > 0) {
        const fileName = this.files[0].name;
        uploadStatus.innerText = `Selected: ${fileName.length > 30 ? fileName.substring(0, 27) + '...' : fileName}`;
        uploadStatus.style.color = 'var(--success-color)';
        fileInputLabel.textContent = 'Change Image';
    } else {
        uploadStatus.innerText = '';
        fileInputLabel.textContent = 'Choose Image';
    }
});

petForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const petName = petNameInput.value.trim();
    const petSpecies = petSpeciesInput.value;
    const petBreed = petBreedInput.value.trim();
    const petAge = petAgeInput.value;
    const vaccinationStatus = vaccinationStatusInput.value;
    const aggressionLevel = aggressionLevelInput.value;
    const petImageFile = petImageInput.files[0];

    if (petName && petSpecies && petBreed && petAge && vaccinationStatus && aggressionLevel) {
        const formData = new FormData();
        formData.append('id', Date.now());
        formData.append('name', petName);
        formData.append('species', petSpecies);
        formData.append('breed', petBreed);
        formData.append('age', parseInt(petAge));
        formData.append('vaccination', vaccinationStatus);
        formData.append('aggression', aggressionLevel);
        if (petImageFile) {
            formData.append('image', petImageFile);
        }

        try {
            const response = await fetch(`${FLASK_BASE_URL}/api/petm`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Failed to register pet');
            await response.json();

            alert(`${petName} registered successfully!`);
            petForm.reset();
            uploadStatus.innerText = '';
            fileInputLabel.textContent = 'Choose Image';
            setActiveView('myPets');
        } catch (error) {
            console.error('Error registering pet:', error);
            alert(`Failed to register pet: ${error.message}`);
        }
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
                deletePet(petId);
            } else {
                console.error("Invalid Pet ID found on element:", petItem);
            }
        }
    }
});

document.getElementById('currentYear').textContent = new Date().getFullYear();

// --- Initial Setup ---
setActiveView('register');