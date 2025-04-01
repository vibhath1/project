// Pet Data
const pets = [
    {
        id: 1,
        name: "Buddy",
        type: "dog",
        breed: "Golden Retriever",
        price: 399,
        age: "8 months",
        gender: "Male",
        images: [
            "https://images.unsplash.com/photo-1633722715463-d30f4f325e24",
            "https://images.unsplash.com/photo-1633722715500-ef89d8ef5445",
            "https://images.unsplash.com/photo-1633722715555-8f0a3a5a0f5a"
        ],
        description: "Friendly and energetic Golden Retriever puppy. Loves playing fetch and going for walks. Already house-trained and knows basic commands."
    },
    {
        id: 2,
        name: "Whiskers",
        type: "cat",
        breed: "Siamese",
        price: 299,
        age: "1 year",
        gender: "Female",
        images: [
            "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
            "https://images.unsplash.com/photo-1519052537078-e6302a4968d4",
            "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"
        ],
        description: "Elegant Siamese cat with beautiful blue eyes. Very affectionate and loves cuddles. Gets along well with other pets."
    },
    {
        id: 3,
        name: "Tweety",
        type: "bird",
        breed: "Canary",
        price: 89,
        age: "6 months",
        gender: "Male",
        images: [
            "https://images.unsplash.com/photo-1555169062-013468b47731",
            "https://images.unsplash.com/photo-1555169062-013468b47732",
            "https://images.unsplash.com/photo-1555169062-013468b47733"
        ],
        description: "Bright yellow canary with a beautiful singing voice. Comes with cage and accessories. Perfect for first-time bird owners."
    },
    {
        id: 4,
        name: "Fluffy",
        type: "rabbit",
        breed: "Holland Lop",
        price: 129,
        age: "4 months",
        gender: "Female",
        images: [
            "https://images.unsplash.com/photo-1556838803-cc94986cb631",
            "https://images.unsplash.com/photo-1556838803-cc94986cb632",
            "https://images.unsplash.com/photo-1556838803-cc94986cb633"
        ],
        description: "Adorable Holland Lop bunny with soft fur and floppy ears. Very gentle and loves being petted. Litter-box trained."
    },
    {
        id: 5,
        name: "Max",
        type: "dog",
        breed: "French Bulldog",
        price: 899,
        age: "10 months",
        gender: "Male",
        images: [
            "https://images.unsplash.com/photo-1633722715463-d30f4f325e24",
            "https://images.unsplash.com/photo-1633722715500-ef89d8ef5445",
            "https://images.unsplash.com/photo-1633722715555-8f0a3a5a0f5a"
        ],
        description: "Playful French Bulldog with a great personality. Gets along with everyone and loves attention. Comes with AKC papers."
    },
    {
        id: 6,
        name: "Luna",
        type: "cat",
        breed: "Maine Coon",
        price: 499,
        age: "1.5 years",
        gender: "Female",
        images: [
            "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
            "https://images.unsplash.com/photo-1519052537078-e6302a4968d4",
            "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"
        ],
        description: "Majestic Maine Coon with luxurious fur. Very intelligent and friendly. Loves playing with water and climbing cat trees."
    }
];

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

// State
let cart = [];
let currentPet = null;

// Initialize the page
function init() {
    renderPetCards(pets);
    setupEventListeners();
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
                    <span class="pet-price">$${pet.price}</span>
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
    
    // Set main image
    const mainImage = modalContent.querySelector('.main-image');
    mainImage.src = pet.images[0];
    mainImage.alt = pet.name;
    
    // Set pet details
    modalContent.querySelector('.pet-name').textContent = pet.name;
    modalContent.querySelector('.pet-description').textContent = pet.description;
    modalContent.querySelector('.pet-type').textContent = pet.type;
    modalContent.querySelector('.pet-price').textContent = `$${pet.price}`;
    
    // Create thumbnails
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
    
    // Show modal
    petModal.style.display = 'flex';
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Toggle cart modal
function toggleCart() {
    if (cartModal.style.display === 'flex') {
        cartModal.style.display = 'none';
    } else {
        renderCartItems();
        cartModal.style.display = 'flex';
    }
}

// Add to cart
function addToCart() {
    if (!currentPet) return;
    
    // Check if pet is already in cart
    const existingItem = cart.find(item => item.id === currentPet.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...currentPet,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${currentPet.name} added to cart!`);
    closeModal('pet-modal');
}

// Render cart items
function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.images[0]}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <div class="cart-item-meta">
                    <span class="cart-item-price">$${item.price}</span>
                    <span class="cart-item-quantity">Qty: ${item.quantity}</span>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Remove from cart
function removeFromCart(petId) {
    cart = cart.filter(item => item.id !== petId);
    updateCart();
    showNotification('Item removed from cart');
}

// Clear cart
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        updateCart();
        showNotification('Cart cleared');
    }
}

// Update cart UI
function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    renderCartItems();
}

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
    priceValueDisplay.textContent = value;
}

// Show notification
function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    // Close modals when clicking outside content
    [petModal, cartModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Filter event listeners
    petTypeFilter.addEventListener('change', applyFilters);
    priceRangeFilter.addEventListener('input', () => {
        updatePriceDisplay(priceRangeFilter.value);
        applyFilters();
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);

// Expose functions to global scope for HTML onclick handlers
window.toggleCart = toggleCart;
window.closeModal = closeModal;
window.addToCart = addToCart;
window.clearCart = clearCart;
window.removeFromCart = removeFromCart;