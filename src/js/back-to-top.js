document.addEventListener("DOMContentLoaded", function () {
	// Get the back to top button
	const backToTopButton = document.getElementById("back-to-top");

	// Ensure button is part of the tab order
	backToTopButton.setAttribute("tabindex", "0");

	// Show the button when scrolling down
	window.addEventListener("scroll", function () {
		// Show button when user scrolls down 300px from the top
		if (window.pageYOffset > 300) {
			backToTopButton.classList.add("visible");
		} else {
			backToTopButton.classList.remove("visible");

			// Make sure we don't hide the button when it has focus
			if (document.activeElement === backToTopButton) {
				backToTopButton.classList.add("visible");
			}
		}
	});

	// Handle button activation via keyboard (Enter and Space)
	backToTopButton.addEventListener("keydown", function (e) {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			scrollToTop();
		}
	});

	// Scroll to top when button is clicked
	backToTopButton.addEventListener("click", function (e) {
		e.preventDefault();
		scrollToTop();
	});

	// Function to handle scroll to top
	function scrollToTop() {
		// Announce to screen readers
		announceToScreenReader("Retour en haut de la page");

		// Smooth scroll to top
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});

		// Set focus to the top of the page (first focusable element)
		setTimeout(function () {
			const firstFocusable = document.querySelector(
				'a, button, input, [tabindex="0"]'
			);
			if (firstFocusable) {
				firstFocusable.focus();
			}
		}, 1000); // Time to allow scroll completion
	}

	// Add focus/blur event handlers to ensure visibility when focused
	backToTopButton.addEventListener("focus", function () {
		backToTopButton.classList.add("visible");
	});

	backToTopButton.addEventListener("blur", function () {
		if (window.pageYOffset <= 300) {
			backToTopButton.classList.remove("visible");
		}
	});

	// Helper function to announce changes to screen readers
	function announceToScreenReader(message) {
		let announcement = document.getElementById("scroll-announcement");

		if (!announcement) {
			announcement = document.createElement("div");
			announcement.id = "scroll-announcement";
			announcement.setAttribute("aria-live", "polite");
			announcement.className = "sr-only";
			document.body.appendChild(announcement);
		}

		announcement.textContent = message;
	}
});
