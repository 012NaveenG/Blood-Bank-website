const carousel = document.querySelector('.carousel');
const carouselContainer = document.querySelector('.carousel-container');
const carouselItems = document.querySelectorAll('.carousel-item');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentIndex = 0;

// Add event listeners to the navigation buttons
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
    updateCarousel();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % carouselItems.length;
    updateCarousel();
});

// Function to update the carousel display
function updateCarousel() {
    const itemWidth = carouselItems[0].offsetWidth;
    const offset = -currentIndex * itemWidth;
    carouselContainer.style.transform = `translateX(${offset}px)`;
}
