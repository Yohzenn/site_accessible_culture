document.addEventListener("DOMContentLoaded", () => {
	const carousel = document.querySelector(".carousel-slides");
	const slides = Array.from(carousel.querySelectorAll(".slide"));
	const dots = Array.from(document.querySelectorAll(".carousel-dots button"));
	const prevButton = document.querySelector(".prev");
	const nextButton = document.querySelector(".next");
	let currentSlide = 0;

	carousel.setAttribute("role", "region");
	carousel.setAttribute("aria-label", "Image Carousel");

	prevButton.setAttribute("aria-label", "Previous Slide");
	nextButton.setAttribute("aria-label", "Next Slide");

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
