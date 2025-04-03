// DOM Elements
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const petForm = document.getElementById('pet-form');
const petList = document.getElementById('pet-list');
const deleteModal = document.getElementById('delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const alertToast = document.getElementById('alert-toast');
const alertMessage = document.getElementById('alert-message');

// State
let pets = [];
let petToDelete = null;

// Initialize the app
function init() {
    setupEventListeners();
    showSection('add-pet');
    fetchPets();  // Load pets from database
}

// Set up event listeners
function setupEventListeners() {
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            showSection(button.getAttribute('data-section'));
        });
    });

    petForm.addEventListener('submit', handlePetFormSubmit);
    confirmDeleteBtn.addEventListener('click', confirmDelete);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
}

// Show a specific section
function showSection(sectionId) {
    navButtons.forEach(button => {
        button.classList.toggle('active', button.getAttribute('data-section') === sectionId);
    });

    sections.forEach(section => {
        section.classList.toggle('active-section', section.id === `${sectionId}`);
    });

    if (sectionId === 'view-pets') {
        fetchPets(); // Reload pets when viewing
    }
}

// Handle pet form submission (Add Pet)
async function handlePetFormSubmit(e) {
    e.preventDefault();

    const petData = {
        name: document.getElementById('pet-name').value,
        species: document.getElementById('pet-species').value, // Added Species Field
        breed: document.getElementById('pet-breed').value,
        age: document.getElementById('pet-age').value,
        description: document.getElementById('pet-desc').value,
        contact_email: document.getElementById('contact-email').value,
        contact_phone: document.getElementById('contact-phone').value
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/pets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(petData)
        });

        if (!response.ok) throw new Error('Failed to add pet');

        showAlert('success', 'Pet added successfully!');
        petForm.reset();
        fetchPets(); // Reload pet list after adding
    } catch (error) {
        showAlert('error', error.message);
    }
}

// Fetch pets from backend (NO TOKEN REQUIRED)
async function fetchPets() {
    try {
        const response = await fetch('http://127.0.0.1:5000/pets', { method: 'GET' });

        if (!response.ok) throw new Error('Failed to fetch pets');

        pets = await response.json();
        renderPets();
    } catch (error) {
        showAlert('error', error.message);
    }
}

// Render pets
function renderPets() {
    petList.innerHTML = pets.length
        ? pets.map(pet => `
            <div class="pet-card" data-id="${pet.id}">
                <h3>${pet.name}</h3>
                <p>Species: ${pet.species}</p>
                <p>Breed: ${pet.breed}</p>
                <p>Age: ${pet.age} years</p>
                <p>${pet.description || 'No description'}</p>
                <p>Contact: ${pet.contact_email} ${pet.contact_phone ? `| ${pet.contact_phone}` : ''}</p>
                <button class="delete-btn" onclick="openDeleteModal(${pet.id})">Delete</button>
            </div>
        `).join('')
        : `<p>No pets available.</p>`;
}

// Open delete confirmation modal
function openDeleteModal(petId) {
    petToDelete = petId;
    deleteModal.classList.add('active');
}

// Close delete modal
function closeDeleteModal() {
    petToDelete = null;
    deleteModal.classList.remove('active');
}

// Confirm pet deletion
async function confirmDelete() {
    if (!petToDelete) return;

    try {
        const response = await fetch(`/pets/${petToDelete}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete pet');

        showAlert('success', 'Pet removed successfully');
        closeDeleteModal();
        fetchPets(); // Refresh pets after deletion
    } catch (error) {
        showAlert('error', error.message);
    }
}

// Show alert message
function showAlert(type, message) {
    alertMessage.textContent = message;
    alertToast.className = `toast ${type}`;
    setTimeout(() => alertToast.className = 'toast hidden', 3000);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);

// Expose functions globally for HTML onclick attributes
window.showSection = showSection;
window.openDeleteModal = openDeleteModal;
