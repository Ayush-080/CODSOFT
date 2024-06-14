document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Toggle active tab and content
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Close all dropdowns before opening new tab content
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.style.display = 'none';
            });

            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabContents.forEach(content => content.classList.remove('active'));
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Initialize flatpickr for date inputs
    flatpickr('#departure-date', { dateFormat: 'Y-m-d' });
    flatpickr('#return-date', { dateFormat: 'Y-m-d' });
    flatpickr('#checkin-date', { dateFormat: 'Y-m-d' });
    flatpickr('#checkout-date', { dateFormat: 'Y-m-d' });
    flatpickr('#pickup-date', { dateFormat: 'Y-m-d' });
    flatpickr('#pickup-time', { enableTime: true, noCalendar: true, dateFormat: 'H:i' });

    // Handle city input and dropdown interaction
    document.querySelectorAll('.city-input').forEach(input => {
        const cityList = input.nextElementSibling;

        // Show city list on input focus
        input.addEventListener('focus', () => {
            cityList.style.display = 'block';
        });

        // Hide city list on input blur (with delay)
        input.addEventListener('blur', () => {
            setTimeout(() => {
                cityList.style.display = 'none';
            }, 200);
        });

        // Set city on city list item click
        cityList.querySelectorAll('a').forEach(city => {
            city.addEventListener('click', (event) => {
                event.preventDefault();
                input.value = event.target.textContent;
                // Hide city list after selection
                cityList.style.display = 'none';
            });
        });

        // Prevent city list from closing on click inside city list
        cityList.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent event from bubbling to input blur
        });
    });

    // Close modal on close button click
    const closeButton = document.querySelector('.close-button');
    const modal = document.getElementById('modal');

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal on outside click
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Toggle dropdown visibility on tab button click
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const dropdown = button.querySelector('.dropdown');
            if (dropdown) {
                // Close other open dropdowns
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    if (dropdown !== button.querySelector('.dropdown')) {
                        dropdown.style.display = 'none';
                    }
                });
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            }
        });
    });

    // Smooth scroll to section on anchor click
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition - headerOffset;
                window.scrollBy({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle form submission for flights, hotels, and cabs
    document.querySelectorAll('.search-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            let formData = {};
            const dropdown = button.closest('.dropdown');

            if (dropdown.classList.contains('flight-dropdown')) {
                formData = {
                    type: 'flight',
                    fromCity: document.getElementById('from-city').value,
                    toCity: document.getElementById('to-city').value,
                    departureDate: document.getElementById('departure-date').value,
                    returnDate: document.getElementById('return-date').value,
                    cabinClass: document.getElementById('cabin-class').value,
                    adults: document.getElementById('adults').value,
                    children: document.getElementById('children').value
                };
            } else if (dropdown.classList.contains('hotel-dropdown')) {
                formData = {
                    type: 'hotel',
                    city: document.getElementById('hotel-city').value,
                    checkinDate: document.getElementById('checkin-date').value,
                    checkoutDate: document.getElementById('checkout-date').value,
                    rooms: document.getElementById('rooms').value,
                    adults: document.getElementById('hotel-adults').value,
                    children: document.getElementById('hotel-children').value
                };
            } else if (dropdown.classList.contains('cab-dropdown')) {
                formData = {
                    type: 'cab',
                    fromCity: document.getElementById('cab-from-city').value,
                    toCity: document.getElementById('cab-to-city').value,
                    pickupDate: document.getElementById('pickup-date').value,
                    pickupTime: document.getElementById('pickup-time').value
                };
            }

            try {
                const response = await fetch('http://localhost:3000/book', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();

                if (result.success) {
                    displaySearchResults(result.data); // Display search results
                } else {
                    alert('Booking failed: ' + result.message);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    });

    // Function to display search results
    function displaySearchResults(data) {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = ''; // Clear previous results

        data.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');

            // Customize this part based on the data structure of the API response
            resultItem.innerHTML = `
                <h3>${item.flightName}</h3>
                <p>From: ${item.fromCity} To: ${item.toCity}</p>
                <p>Departure: ${item.departureDate} Return: ${item.returnDate}</p>
                <p>Cabin Class: ${item.cabinClass}</p>
                <p>Price: ${item.price}</p>
            `;

            resultsContainer.appendChild(resultItem);
        });

        document.getElementById('search-results-section').style.display = 'block';
    }
});
