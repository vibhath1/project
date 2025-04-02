// DOM Elements
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const petForm = document.getElementById('pet-form');
const petList = document.getElementById('pet-list');
const contactForm = document.getElementById('contact-form');
const deleteModal = document.getElementById('delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const alertToast = document.getElementById('alert-toast');
const alertMessage = document.getElementById('alert-message');
const imagePreview = document.getElementById('image-preview');
const petImageInput = document.getElementById('pet-image');

// State
let pets = JSON.parse(localStorage.getItem('pets')) || [];
let petToDelete = null;

// Initialize the app
function init() {
    // Set up event listeners
    setupEventListeners();
    
    // Show the first section by default
    showSection('add-pet');
    
    // Load pets if any exist
    if (pets.length > 0) {
        renderPets();
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Pet form submission
    petForm.addEventListener('submit', handlePetFormSubmit);

    // Contact form submission
    contactForm.addEventListener('submit', handleContactFormSubmit);

    // Image preview
    petImageInput.addEventListener('change', handleImageUpload);

    // Delete modal buttons
    confirmDeleteBtn.addEventListener('click', confirmDelete);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
}

// Show a specific section
function showSection(sectionId) {
    console.log(`Showing section: ${sectionId}`); // Debug log
    
    // Update active nav button
    navButtons.forEach(button => {
        const btnSection = button.getAttribute('data-section');
        if (btnSection === sectionId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    // Show the selected section
    sections.forEach(section => {
        const sectionName = section.id.replace('-section', '');
        if (sectionName === sectionId) {
            section.classList.add('active-section');
            console.log(`Showing: ${section.id}`); // Debug log
        } else {
            section.classList.remove('active-section');
        }
    });

    // If showing pets section, refresh the list
    if (sectionId === 'view-pets') {
        console.log('Refreshing pet list'); // Debug log
        renderPets();
    }
}

// Handle pet form submission
// In your sell.js
async function handlePetFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('image', document.getElementById('pet-image').files[0]);
    formData.append('name', document.getElementById('pet-name').value);
    formData.append('species', document.getElementById('pet-breed').value);
    formData.append('age', document.getElementById('pet-age').value);
    formData.append('description', document.getElementById('pet-desc').value);
    
    try {
        const response = await fetch('/pets', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                // Let browser set Content-Type automatically
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add pet');
        }
        
        // Handle success
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}
// Handle contact form submission
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validation
    if (!name || !email || !message) {
        showAlert('error', 'Please fill in all fields');
        return;
    }

    if (!validateEmail(email)) {
        showAlert('error', 'Please enter a valid email address');
        return;
    }

    // In a real app, you would send this data to a server
    console.log('Contact form submitted:', { name, email, message });
    
    // Reset form
    contactForm.reset();
    
    // Show success message
    showAlert('success', 'Message sent successfully!');
}

// Handle image upload and preview
function handleImageUpload(e) {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showAlert('error', 'Image size must be less than 5MB');
        e.target.value = '';
        return;
    }

    // Check file type
    if (!file.type.match('image.*')) {
        showAlert('error', 'Please select an image file');
        e.target.value = '';
        return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
        imagePreview.innerHTML = '';
        const img = document.createElement('img');
        img.src = event.target.result;
        imagePreview.appendChild(img);
    };
    reader.readAsDataURL(file);
}

// Render all pets to the list
function renderPets() {
    if (pets.length === 0) {
        petList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-paw"></i>
                <p>No pets available yet. Add your first pet!</p>
            </div>
        `;
        return;
    }

    petList.innerHTML = pets.map(pet => `
        <div class="pet-card" data-id="${pet.id}">
            <div class="pet-image-container">
                <img src="${pet.image || 'https://images.pexels.com/photos/3761509/pexels-photo-3761509.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}" 
                     alt="${pet.name}" class="pet-image">
            </div>
            <div class="pet-details">
                <h3 class="pet-name">${pet.name}</h3>
                <p class="pet-breed">${pet.breed}</p>
                <p class="pet-age">${pet.age} years old</p>
                <p class="pet-description">${pet.description}</p>
                <div class="pet-actions">
                    <button class="action-btn contact-btn" onclick="contactSeller(${pet.id})">
                        <i class="fas fa-envelope"></i> Contact
                    </button>
                    <button class="action-btn delete-btn" onclick="openDeleteModal(${pet.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
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
function confirmDelete() {
    if (!petToDelete) return;
    
    // Remove pet from array
    pets = pets.filter(pet => pet.id !== petToDelete);
    
    // Update localStorage
    localStorage.setItem('pets', JSON.stringify(pets));
    
    // Re-render pets
    renderPets();
    
    // Close modal
    closeDeleteModal();
    
    // Show success message
    showAlert('success', 'Pet removed successfully');
}

// Contact seller - pre-fills contact form
function contactSeller(petId) {
    const pet = pets.find(p => p.id === petId);
    if (!pet) return;
    
    // Pre-fill contact form
    document.getElementById('name').value = '';
    document.getElementById('email').value = pet.email;
    document.getElementById('message').value = `Hi, I'm interested in ${pet.name} the ${pet.breed}.`;
    
    // Show contact section
    showSection('contact');
}

// Show alert/toast message
function showAlert(type, message) {
    alertMessage.textContent = message;
    alertToast.className = `toast ${type}`;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        alertToast.className = 'toast hidden';
    }, 3000);
}

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Make functions available globally for HTML onclick attributes
window.showSection = showSection;
window.contactSeller = contactSeller;
window.openDeleteModal = openDeleteModal;