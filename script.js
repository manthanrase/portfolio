document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(".scroll-reveal")
    .forEach((el) => observer.observe(el));
});

const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".carousel-slide");
const prevButton = document.querySelector(".carousel-button.prev");
const nextButton = document.querySelector(".carousel-button.next");

let index = 0;

function updateSlidePosition() {
  track.style.transform = `translateX(-${index * 100}%)`;
  updateButtonVisibility();
}

function nextSlide() {
  if (index < slides.length - 4) {
    index++;
    updateSlidePosition();
  }
}

function prevSlide() {
  if (index > 0) {
    index--;
    updateSlidePosition();
  }
}

function updateButtonVisibility() {
  prevButton.style.display = index === 0 ? "none" : "block";
  nextButton.style.display = index === slides.length - 4 ? "none" : "block";
}

prevButton.addEventListener("click", prevSlide);
nextButton.addEventListener("click", nextSlide);

// Initial state
updateSlidePosition();

// persona scrolling

const personaTrack = document.querySelector(
  "#persona-carousel .carousel-track"
);
const personaSlides = document.querySelectorAll(
  "#persona-carousel .carousel-slide"
);
const personaPrev = document.querySelector(
  "#persona-carousel .carousel-button.prev"
);
const personaNext = document.querySelector(
  "#persona-carousel .carousel-button.next"
);

let personaIndex = 0;

function updatePersonaPosition() {
  personaTrack.style.transform = `translateX(-${personaIndex * 100}%)`;
  personaPrev.style.display = personaIndex === 0 ? "none" : "block";
  personaNext.style.display =
    personaIndex === personaSlides.length - 1 ? "none" : "block";
}

personaPrev.addEventListener("click", () => {
  if (personaIndex > 0) {
    personaIndex--;
    updatePersonaPosition();
  }
});

personaNext.addEventListener("click", () => {
  if (personaIndex < personaSlides.length - 1) {
    personaIndex++;
    updatePersonaPosition();
  }
});

// Initialize on load
updatePersonaPosition();

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
