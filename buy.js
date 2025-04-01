document.addEventListener('DOMContentLoaded', function() {
    const petsGrid = document.getElementById('petsGrid');
    const petTypeRadios = document.getElementsByName('petType');
    const stateSelect = document.getElementById('stateSelect');
    const citySelect = document.getElementById('citySelect');
    const applyFiltersBtn = document.querySelector('.apply-filters');
    const modal = document.getElementById('petModal');
    const modalClose = modal.querySelector('.modal-close');

    // Pet data (in production, this would come from an API)
    const products = {
        1: {
            name: 'Max',
            breed: 'Golden Retriever',
            age: '2 years',
            gender: 'Male',
            location: 'San Francisco, CA',
            image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80',
            vaccinations: [
                { name: 'Rabies', date: '2023-05-15' },
                { name: 'DHPP', date: '2023-04-20' },
                { name: 'Bordetella', date: '2023-06-01' }
            ],
            traits: ['Friendly', 'Energetic', 'Good with kids', 'Trained', 'Playful'],
            biography: 'Max is a loving and energetic Golden Retriever...',
            contact: {
                phone: '(555) 123-4567',
                email: 'adopt@ggashelter.org',
                hours: '9:00 AM - 5:00 PM',
                location: '123 Shelter Lane, San Francisco, CA'
            }
        },
        // Add more pet data as needed
    };

    // Handle view details button clicks
    document.querySelectorAll('.view-details-button').forEach(button => {
        button.addEventListener('click', function() {
            const petId = this.dataset.petId;
            const pet = products[petId]; // Use products instead of petData
            
            if (pet) {
                // Populate modal with pet data
                modal.querySelector('.pet-profile-image').src = pet.image;
                modal.querySelector('#modalTitle').textContent = pet.name;
                modal.querySelector('.pet-profile-breed').textContent = pet.breed;
                modal.querySelector('.pet-profile-details').textContent = `${pet.age} • ${pet.gender}`;
                modal.querySelector('.pet-profile-location').textContent = pet.location;

                // Vaccinations
                const vaccinationList = modal.querySelector('.vaccination-list');
                vaccinationList.innerHTML = pet.vaccinations.map(vax => 
                    `<div class="vaccination-item"><strong>${vax.name}</strong><div>${new Date(vax.date).toLocaleDateString()}</div></div>`
                ).join('');

                // Personality traits
                const personalityTraits = modal.querySelector('.personality-traits');
                personalityTraits.innerHTML = pet.traits.map(trait => 
                    `<span class="trait-tag">${trait}</span>`
                ).join('');

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

    // Cart functionality
    let cart = [];
    const cartOverlay = document.getElementById('cart');
    const closeCartBtn = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalDisplay = document.getElementById('cartTotal');
    const cartCountDisplay = document.getElementById('cartCount');

    // Add event listeners to "Adopt Now" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));

            // Check if item is already in cart
            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                // Just increase quantity instead of adding duplicate
                existingItem.quantity += 1;
            } else {
                // Add new item to cart
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }

            updateCart();
            openCart();
        });
    });

    function openCart() {
        cartOverlay.classList.add('active');
    }

    function closeCart() {
        cartOverlay.classList.remove('active');
    }

    closeCartBtn.addEventListener('click', closeCart);

    function updateCart() {
        // Clear cart items container
        cartItemsContainer.innerHTML = '';

        // Update cart count display
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountDisplay.textContent = totalItems;

        // Check if cart is empty
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    Your adoption cart is empty
                </div>
            `;
            updateTotal();
            return;
        }

        // Add each item to the cart display
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <div class="cart-item-details">
                    <h3 class="item-title">${item.name}</h3>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                    <div class="item-quantity">
                        <span class="quantity-display">${item.quantity}</span>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">×</button>
            `;

            cartItemsContainer.appendChild(cartItemElement);
        });

        // Add event listeners to newly created buttons
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                removeItem(id);
            });
        });

        // Update total
        updateTotal();
    }

    function removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }

    function updateTotal() {
        const total = cart.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        cartTotalDisplay.textContent = `$${total.toFixed(2)}`;
    }

    // Initialize cart display
    updateCart();
});