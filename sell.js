// DOM Elements
const petForm = document.getElementById('pet-form');
const petList = document.getElementById('pet-list');
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const deleteModal = document.getElementById('delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const alertToast = document.getElementById('alert-toast');
const alertMessage = document.getElementById('alert-message');
const petImageInput = document.getElementById('pet-image');
const imagePreview = document.getElementById('image-preview');

const FLASK_BASE_URL = 'http://127.0.0.1:5000';

// Navigation
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const sectionId = button.dataset.section;
        navButtons.forEach(btn => btn.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active-section'));
        button.classList.add('active');
        document.getElementById(sectionId).classList.add('active-section');

        if (sectionId === 'view-pets') {
            displayPets();
        }
    });
});

// Image Preview
petImageInput.addEventListener('change', function() {
    imagePreview.innerHTML = '';
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100px';
            img.style.maxHeight = '100px';
            imagePreview.appendChild(img);
        };
        reader.readAsDataURL(this.files[0]);
    }
});

// Add Pet
petForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id', Date.now());
    formData.append('name', document.getElementById('pet-name').value);
    formData.append('species', document.getElementById('pet-species').value);
    formData.append('breed', document.getElementById('pet-breed').value);
    formData.append('age', document.getElementById('pet-age').value || 0);
    formData.append('pet-desc', document.getElementById('pet-desc').value);
    formData.append('contact_email', document.getElementById('contact-email').value);
    formData.append('contact_phone', document.getElementById('contact-phone').value);
    formData.append('price', document.getElementById('pet-price').value); // Add price
    if (petImageInput.files[0]) {
        formData.append('image', petImageInput.files[0]);
    }

    try {
        const response = await fetch(`${FLASK_BASE_URL}/api/sell_pets`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to add pet: ${errorData.error || 'Unknown error'}`);
        }
        await response.json();

        showToast('Pet added successfully!');
        petForm.reset();
        imagePreview.innerHTML = '';
        document.querySelector('.nav-btn[data-section="view-pets"]').click();
    } catch (error) {
        console.error('Error adding pet:', error);
        showToast(error.message, true);
    }
});

// Display Pets
async function displayPets() {
    petList.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch(`${FLASK_BASE_URL}/api/sell_pets`);
        if (!response.ok) throw new Error('Failed to fetch pets');
        const pets = await response.json();

        petList.innerHTML = '';
        if (pets.length === 0) {
            petList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-paw"></i>
                    <p>No pets available yet. Add your first pet!</p>
                </div>
            `;
        } else {
            pets.forEach(pet => {
                const petCard = document.createElement('div');
                petCard.classList.add('pet-card');
                petCard.dataset.id = pet.id;

                const imageUrl = pet.image_name ? `${FLASK_BASE_URL}/static/uploads/${pet.image_name}` : null;

                petCard.innerHTML = `
                    ${imageUrl ? `<img src="${imageUrl}" alt="${pet.name}" class="pet-image" style="max-width: 150px; max-height: 150px;">` : ''}
                    <h3>${pet.name}</h3>
                    <p><strong>Species:</strong> ${pet.species}</p>
                    <p><strong>Breed:</strong> ${pet.breed}</p>
                    <p><strong>Age:</strong> ${pet.age} years</p>
                    <p><strong>Description:</strong> ${pet.description || 'No description'}</p>
                    <p><strong>Email:</strong> ${pet.contact_email}</p>
                    <p><strong>Phone:</strong> ${pet.contact_phone || 'N/A'}</p>
                    <p><strong>Price:</strong> ₹${pet.price}</p> <!-- Add price display -->
                    <button class="delete-btn">Delete</button>
                `;
                petList.appendChild(petCard);
            });
        }
    } catch (error) {
        console.error('Error fetching pets:', error);
        petList.innerHTML = `<p>Failed to load pets: ${error.message}</p>`;
    }
}

// Delete Pet
let petToDeleteId = null;

petList.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        petToDeleteId = e.target.closest('.pet-card').dataset.id;
        deleteModal.classList.add('active');
    }
});

confirmDeleteBtn.addEventListener('click', async function() {
    if (petToDeleteId) {
        try {
            const response = await fetch(`${FLASK_BASE_URL}/api/sell_pets/${petToDeleteId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete pet');
            await response.json();

            showToast('Pet deleted successfully!');
            deleteModal.classList.remove('active');
            displayPets();
        } catch (error) {
            console.error('Error deleting pet:', error);
            showToast(`Failed to delete pet: ${error.message}`, true);
        }
        petToDeleteId = null;
    }
});

cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.classList.remove('active');
    petToDeleteId = null;
});

// Toast Notification
function showToast(message, isError = false) {
    alertMessage.textContent = message;
    alertToast.classList.remove('hidden');
    alertToast.classList.toggle('error', isError);
    setTimeout(() => alertToast.classList.add('hidden'), 3000);
}

// Initial Load
displayPets();