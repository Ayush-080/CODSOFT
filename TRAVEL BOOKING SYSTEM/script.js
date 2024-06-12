document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            tabButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            tabContents.forEach(content => content.classList.remove("active"));
            const tabId = button.getAttribute("data-tab");
            document.getElementById(tabId).classList.add("active");
        });
    });

    flatpickr("#departure-date", { dateFormat: "Y-m-d" });
    flatpickr("#return-date", { dateFormat: "Y-m-d" });
    flatpickr("#checkin-date", { dateFormat: "Y-m-d" });
    flatpickr("#checkout-date", { dateFormat: "Y-m-d" });
    flatpickr("#pickup-date", { dateFormat: "Y-m-d" });
    flatpickr("#pickup-time", { enableTime: true, noCalendar: true, dateFormat: "H:i" });

    document.querySelectorAll('.city-input').forEach(input => {
        input.addEventListener('focus', () => {
            const cityList = input.nextElementSibling;
            cityList.style.display = 'block';
        });

        input.addEventListener('blur', () => {
            setTimeout(() => {
                const cityList = input.nextElementSibling;
                cityList.style.display = 'none';
            }, 200);
        });

        input.nextElementSibling.querySelectorAll('a').forEach(city => {
            city.addEventListener('click', (event) => {
                input.value = event.target.textContent;
            });
        });
    });

    const modal = document.getElementById("modal");
    const closeButton = document.querySelector(".close-button");

    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    const handleDropdownToggle = (button, dropdownSelector) => {
        const dropdown = button.querySelector(dropdownSelector);
        button.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
    };

    handleDropdownToggle(document.querySelector('.tab-button[data-tab="flights"]'), '.flight-dropdown');
    handleDropdownToggle(document.querySelector('.tab-button[data-tab="hotels"]'), '.hotel-dropdown');
    handleDropdownToggle(document.querySelector('.tab-button[data-tab="cabs"]'), '.cab-dropdown');

    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const dropdown = button.querySelector('.flight-dropdown, .hotel-dropdown, .cab-dropdown');
            if (dropdown) {
                dropdown.classList.toggle('show-dropdown');
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            const headerOffset = document.querySelector('header').offsetHeight;

            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollBy({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
