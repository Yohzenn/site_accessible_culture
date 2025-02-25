document.addEventListener("DOMContentLoaded", () => {
	const menuToggle = document.querySelector(".menu-toggle");
	const navMenu = document.querySelector("nav ul");
	const body = document.body;
	let navOverlay;

	// Create overlay element
	function createOverlay() {
		navOverlay = document.createElement("div");
		navOverlay.className = "nav-overlay";
		body.appendChild(navOverlay);

		navOverlay.addEventListener("click", () => {
			closeMenu();
		});
	}

	// Initialize
	createOverlay();

	// Toggle menu function
	function toggleMenu() {
		navMenu.classList.toggle("active");
		navOverlay.classList.toggle("active");

		// Set appropriate ARIA attributes
		const expanded = navMenu.classList.contains("active");
		menuToggle.setAttribute("aria-expanded", expanded);

		// Prevent background scrolling when menu is open
		if (expanded) {
			body.style.overflow = "hidden";
		} else {
			body.style.overflow = "";
		}
	}

	function closeMenu() {
		navMenu.classList.remove("active");
		navOverlay.classList.remove("active");
		menuToggle.setAttribute("aria-expanded", "false");
		body.style.overflow = "";
	}

	// Event listeners
	menuToggle.addEventListener("click", toggleMenu);

	// Close menu when pressing Escape key
	window.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && navMenu.classList.contains("active")) {
			closeMenu();
		}
	});

	// Handle resize events
	window.addEventListener("resize", () => {
		if (window.innerWidth > 768 && navMenu.classList.contains("active")) {
			closeMenu();
		}
	});
});
