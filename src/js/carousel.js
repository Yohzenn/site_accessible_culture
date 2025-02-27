document.addEventListener("DOMContentLoaded", () => {
	const carousel = document.querySelector(".carousel-slides");
	const slides = Array.from(carousel.querySelectorAll(".slide"));
	const dots = Array.from(document.querySelectorAll(".carousel-dots button"));
	const prevButton = document.querySelector(".prev");
	const nextButton = document.querySelector(".next");
	const liveRegion = document.getElementById("carousel-live-region");
	let currentSlide = 0;

	carousel.setAttribute("role", "region");
	carousel.setAttribute("aria-label", "Carrousel de présentation");

	prevButton.setAttribute("aria-label", "Slide Précedente");
	nextButton.setAttribute("aria-label", "Slide Suivante");

	function updateSlides(newIndex) {
		slides.forEach((slide, index) => {
			slide.setAttribute("aria-hidden", index !== newIndex);
			if (index === newIndex) {
				slide.removeAttribute("tabindex");
			} else {
				slide.setAttribute("tabindex", "-1");
			}
		});

		dots.forEach((dot, index) => {
			dot.setAttribute("aria-selected", index === newIndex);
		});

		currentSlide = newIndex;
		updateLiveRegion();
	}

	function updateLiveRegion() {
		const currentSlideElement = slides[currentSlide];
		const heading = currentSlideElement.querySelector("h2").textContent;
		const description = currentSlideElement.querySelector("p").textContent;
		liveRegion.textContent = `Slide ${currentSlide + 1} of ${
			slides.length
		} displayed: ${heading} - ${description}`;
	}

	// Initialize first slide
	updateSlides(0);

	// Event listeners
	prevButton.addEventListener("click", () => {
		const newIndex = (currentSlide - 1 + slides.length) % slides.length;
		updateSlides(newIndex);
	});

	nextButton.addEventListener("click", () => {
		const newIndex = (currentSlide + 1) % slides.length;
		updateSlides(newIndex);
	});

	dots.forEach((dot, index) => {
		dot.addEventListener("click", () => {
			updateSlides(index);
		});
	});

	// Keyboard navigation
	carousel.addEventListener("keydown", (e) => {
		switch (e.key) {
			case "ArrowLeft":
				prevButton.click();
				break;
			case "ArrowRight":
				nextButton.click();
				break;
		}
	});
});
