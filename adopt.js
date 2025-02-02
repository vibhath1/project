document.addEventListener('DOMContentLoaded', function() {
    const petsGrid = document.getElementById('petsGrid');
    const petTypeRadios = document.getElementsByName('petType');
    const stateSelect = document.getElementById('stateSelect');
    const citySelect = document.getElementById('citySelect');
    const applyFiltersBtn = document.querySelector('.apply-filters');

    // City options by state
    const cityOptions = {
        'CA': ['San Francisco', 'Los Angeles', 'San Diego', 'Sacramento'],
        'NY': ['New York City', 'Buffalo', 'Albany', 'Rochester'],
        'TX': ['Austin', 'Houston', 'Dallas', 'San Antonio'],
        'FL': ['Miami', 'Orlando', 'Tampa', 'Jacksonville']
    };

    // Update city options when state changes
    stateSelect.addEventListener('change', function() {
        const cities = cityOptions[this.value] || [];
        citySelect.innerHTML = '<option value="">Select City</option>' +
            cities.map(city => `<option value="${city}">${city}</option>`).join('');
    });

    // Filter pets
    function filterPets() {
        const selectedType = document.querySelector('input[name="petType"]:checked').value;
        const selectedState = stateSelect.value;
        const selectedCity = citySelect.value;

        const petCards = petsGrid.querySelectorAll('.pet-card');
        
        petCards.forEach(card => {
            const petType = card.dataset.type;
            const location = card.querySelector('.pet-location').textContent;
            
            let showCard = true;

            // Filter by type
            if (selectedType !== 'all' && petType !== selectedType) {
                showCard = false;
            }

            // Filter by state
            if (selectedState && !location.includes(selectedState)) {
                showCard = false;
            }

            // Filter by city
            if (selectedCity && !location.includes(selectedCity)) {
                showCard = false;
            }

            card.style.display = showCard ? 'block' : 'none';
        });
    }

    // Apply filters when button is clicked
    applyFiltersBtn.addEventListener('click', filterPets);

    // Initialize with all pets shown
    filterPets();
});