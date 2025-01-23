// Pet data
const pets = [
    {
        name: "Luna",
        image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80",
        type: "Dog",
        age: "2 years"
    },
    {
        name: "Oliver",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80",
        type: "Cat",
        age: "1 year"
    },
    {
        name: "Max",
        image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80",
        type: "Dog",
        age: "4 years"
    }
];

// Render pet cards
function renderPets() {
    const petGrid = document.getElementById('petGrid');
    
    pets.forEach(pet => {
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        
        petCard.innerHTML = `
            <img src="${pet.image}" alt="${pet.name}">
            <div class="pet-info">
                <h3>${pet.name}</h3>
                <div class="pet-meta">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="8" r="2"/><circle cx="7" cy="15" r="2"/><circle cx="15" cy="15" r="2"/></svg>
                    <span>${pet.type}</span>
                    <span>•</span>
                    <span>${pet.age}</span>
                </div>
                <button class="meet-btn">Meet ${pet.name}</button>
            </div>
        `;
        
        petGrid.appendChild(petCard);
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderPets();
});