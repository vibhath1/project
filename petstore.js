// DOM Elements
const petGrid = document.getElementById('pet-grid');
const cartCount = document.querySelector('.cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const petTypeFilter = document.getElementById('pet-type');
const petModal = document.getElementById('pet-modal');
const cartModal = document.getElementById('cart-modal');

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

// Fetch pets from Flask API
async function fetchPets() {
    try {
        const response = await fetch(`${FLASK_BASE_URL}/api/sell_pets`);
        if (!response.ok) throw new Error('Failed to fetch pets');
        pets = await response.json();
        pets = pets.map(pet => ({
            ...pet,
            type: pet.species, // Alias species to type
            age: `${pet.age} years`, // Convert to string
            gender: pet.gender || 'Unknown'
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

    if (!modalContent) return;

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

    let addToCartButton = modalContent.querySelector('.add-to-cart-btn');
    if (!addToCartButton) {
        addToCartButton = document.createElement('button');
        addToCartButton.className = 'add-to-cart-btn';
        addToCartButton.textContent = 'Add to Cart';
        modalContent.appendChild(addToCartButton);
    }

    addToCartButton.onclick = () => addToCart(pet);
    petModal.style.display = 'flex';
}

// Close modal function
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error(`closeModal called with invalid ID: ${modalId}`);
    }
}

// Toggle cart modal
function toggleCart() {
    if (cartModal.style.display === 'flex') {
        cartModal.style.display = 'none';
    } else {
        updateCart();
        cartModal.style.display = 'flex';
    }
}

// Add pet to cart
function addToCart(pet) {
    const existingItem = cart.find(item => item.id === pet.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...pet, quantity: 1 });
    }
    updateCart();
    showNotification(`${pet.name} added to cart!`);
    closeModal('pet-modal');
}

// Render cart items
function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>₹${item.price * item.quantity}</span>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Remove item from cart
function removeFromCart(petId) {
    cart = cart.filter(item => item.id !== petId);
    updateCart();
    showNotification('Item removed from cart');
}

// Clear cart
function clearCart() {
    if (cart.length > 0 && confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        updateCart();
        showNotification('Cart cleared');
    }
}

// Apply filters
function applyFilters() {
    const typeFilter = petTypeFilter.value;
    const filteredPets = pets.filter(pet => typeFilter === 'all' || pet.type === typeFilter);
    renderPetCards(filteredPets);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
        document.body.removeChild(notification);
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    if (petTypeFilter) petTypeFilter.addEventListener('change', applyFilters);

    // Close modals when clicking outside
    [petModal, cartModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal.id);
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', init);

// Expose functions to global scope
window.toggleCart = toggleCart;
window.closeModal = closeModal;
window.addToCart = addToCart;
window.clearCart = clearCart;
window.removeFromCart = removeFromCart;