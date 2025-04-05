// DOM Elements
const petGrid = document.getElementById('pet-grid');
const cartCount = document.querySelector('.cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const petTypeFilter = document.getElementById('pet-type');
const priceRangeFilter = document.getElementById('price-range');
const priceValueDisplay = document.getElementById('price-value');
const petModal = document.getElementById('pet-modal');
const cartModal = document.getElementById('cart-modal');
const notification = document.getElementById('notification');

const FLASK_BASE_URL = 'http://127.0.0.1:5000';

// State
let cart = [];
let currentPet = null;
let pets = []; // Will be populated from API

// Initialize the page
async function init() {
    await fetchPets();
    renderPetCards(pets);
    setupEventListeners();
}

// Fetch pets from Flask
async function fetchPets() {
    try {
        const response = await fetch(`${FLASK_BASE_URL}/api/sell_pets`);
        if (!response.ok) throw new Error('Failed to fetch pets');
        pets = await response.json();
        // Map age to string for consistency with original petstore.js
        pets = pets.map(pet => ({
            ...pet,
            type: pet.species, // Alias species to type
            age: `${pet.age} years`, // Convert to string
            gender: pet.gender || 'Unknown' // Add default if missing
        }));
    } catch (error) {
        console.error('Error fetching pets:', error);
        petGrid.innerHTML = `<p>Failed to load pets: ${error.message}</p>`;
    }
}

// Render pet cards
function renderPetCards(petsToRender) {
    petGrid.innerHTML = '';
    
    petsToRender.forEach(pet => {
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        petCard.innerHTML = `
            <img src="${pet.images[0]}" alt="${pet.name}" class="pet-image">
            <div class="pet-info">
                <h3 class="pet-name">${pet.name}</h3>
                <div class="pet-meta">
                    <span class="pet-breed">${pet.breed}</span>
                    <span class="pet-price">₹${pet.price}</span>
                </div>
            </div>
        `;
        petCard.addEventListener('click', () => openPetModal(pet));
        petGrid.appendChild(petCard);
    });
}

// Open pet modal
function openPetModal(pet) {
    currentPet = pet;
    const modalContent = petModal.querySelector('.modal-body');
    
    const mainImage = modalContent.querySelector('.main-image');
    mainImage.src = pet.images[0];
    mainImage.alt = pet.name;
    
    modalContent.querySelector('.pet-name').textContent = pet.name;
    modalContent.querySelector('.pet-description').textContent = pet.description || 'No description';
    modalContent.querySelector('.pet-type').textContent = pet.type;
    modalContent.querySelector('.pet-price').textContent = `₹${pet.price}`;
    
    const thumbnailContainer = modalContent.querySelector('.thumbnail-container');
    thumbnailContainer.innerHTML = '';
    
    pet.images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = `${pet.name} thumbnail ${index + 1}`;
        thumbnail.className = 'thumbnail';
        if (index === 0) thumbnail.classList.add('active');
        
        thumbnail.addEventListener('click', () => {
            mainImage.src = image;
            thumbnailContainer.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        });
        
        thumbnailContainer.appendChild(thumbnail);
    });
    
    petModal.style.display = 'flex';
}

// ... (closeModal, toggleCart, addToCart, renderCartItems, removeFromCart, clearCart, updateCart remain unchanged)

// Apply filters
function applyFilters() {
    const typeFilter = petTypeFilter.value;
    const priceFilter = parseInt(priceRangeFilter.value);
    
    const filteredPets = pets.filter(pet => {
        const typeMatch = typeFilter === 'all' || pet.type === typeFilter;
        const priceMatch = pet.price <= priceFilter;
        return typeMatch && priceMatch;
    });
    
    renderPetCards(filteredPets);
}

// Update price display
function updatePriceDisplay(value) {
    priceValueDisplay.textContent = `₹${value}`;
}

// Show notification
function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
}

// Setup event listeners
function setupEventListeners() {
    [petModal, cartModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    });
    
    petTypeFilter.addEventListener('change', applyFilters);
    priceRangeFilter.addEventListener('input', () => {
        updatePriceDisplay(priceRangeFilter.value);
        applyFilters();
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);

// Expose functions to global scope
window.toggleCart = toggleCart;
window.closeModal = closeModal;
window.addToCart = addToCart;
window.clearCart = clearCart;
window.removeFromCart = removeFromCart;