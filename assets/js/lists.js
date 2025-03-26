// Lógica do Carrossel (simples)
const carousel = document.querySelector('.carousel');
const carouselItems = document.querySelectorAll('.carousel-item');
const prevButton = document.querySelector('.carousel-control.prev');
const nextButton = document.querySelector('.carousel-control.next');

let currentIndex = 0;
const itemWidth = carouselItems[0].offsetWidth;
const carouselWidth = itemWidth * carouselItems.length;

carousel.style.width = `${carouselWidth}px`;

nextButton.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % carouselItems.length;
  carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
});

prevButton.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
  carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
});

// Lógica para adicionar filmes ao carrossel (a ser implementada mais tarde)
// Esta parte será mais complexa e envolverá manipulação do DOM e possivelmente
// comunicação com um servidor para persistir os dados.