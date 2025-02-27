document.addEventListener("DOMContentLoaded", () => {
	const menuToggle = document.querySelector(".menu-toggle");
	const navMenu = document.querySelector("nav ul");
	const menuIcon = document.querySelector(".menu-icon");
	const menuText = document.querySelector(".menu-text");
	const body = document.body;
	let navOverlay;

	// Create overlay element
	function createOverlay() {
		navOverlay = document.createElement("div");
		navOverlay.className = "nav-overlay";
		navOverlay.setAttribute("aria-hidden", "true");
		body.appendChild(navOverlay);

		navOverlay.addEventListener("click", () => {
			closeMenu();
		});
	}

	// Initialize
	createOverlay();

	// Toggle menu function
	function toggleMenu() {
		const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
		const newExpandedState = !isExpanded;

		navMenu.classList.toggle("active");
		navOverlay.classList.toggle("active");

		// Update ARIA attributes
		menuToggle.setAttribute("aria-expanded", newExpandedState);
		navMenu.setAttribute("aria-hidden", !newExpandedState);

		// Update menu button text for screen readers
		if (newExpandedState) {
			menuText.textContent = "Fermer le menu principal";
			menuIcon.textContent = "✕"; // Change to "X"
			body.style.overflow = "hidden"; // Prevent background scrolling

			// Announce menu state to screen readers
			announceToScreenReader("Menu ouvert");

			// Set proper tab order for menu items when open
			setTimeout(() => {
				const menuLinks = navMenu.querySelectorAll("a");
				menuLinks.forEach((link, index) => {
					link.setAttribute("tabindex", "0");
				});
			}, 100);
		} else {
			menuText.textContent = "Ouvrir le menu principal";
			menuIcon.textContent = "☰"; // Restore hamburger icon
			body.style.overflow = ""; // Restore scrolling

			// Announce menu state to screen readers
			announceToScreenReader("Menu fermé");

			// Reset tab order when menu is closed
			const menuLinks = navMenu.querySelectorAll("a");
			menuLinks.forEach((link) => {
				link.setAttribute("tabindex", "-1");
			});
		}
	}

	function closeMenu() {
		navMenu.classList.remove("active");
		navOverlay.classList.remove("active");
		menuToggle.setAttribute("aria-expanded", "false");
		navMenu.setAttribute("aria-hidden", "true");
		menuText.textContent = "Ouvrir le menu principal";
		menuIcon.textContent = "☰";
		body.style.overflow = "";

		// Reset tab order when menu is closed
		const menuLinks = navMenu.querySelectorAll("a");
		menuLinks.forEach((link) => {
			link.setAttribute("tabindex", "-1");
		});
	}

	// Helper function to announce changes to screen readers
	function announceToScreenReader(message) {
		let announcement = document.getElementById("menu-announcement");

		if (!announcement) {
			announcement = document.createElement("div");
			announcement.id = "menu-announcement";
			announcement.setAttribute("aria-live", "polite");
			announcement.className = "sr-only";
			document.body.appendChild(announcement);
		}

		announcement.textContent = message;
	}

	// Set initial state based on viewport width
	function setInitialMenuState() {
		const isMobile = window.innerWidth <= 1165;

		// If on mobile, set proper ARIA attributes and tabindex
		if (isMobile) {
			navMenu.setAttribute("aria-hidden", "true");

			// Set tabindex to -1 for menu items when hidden on mobile
			const menuLinks = navMenu.querySelectorAll("a");
			menuLinks.forEach((link) => {
				link.setAttribute("tabindex", "-1");
			});
		} else {
			// On desktop, menu should be visible and accessible
			navMenu.setAttribute("aria-hidden", "false");

			// Reset tabindex for desktop
			const menuLinks = navMenu.querySelectorAll("a");
			menuLinks.forEach((link) => {
				link.removeAttribute("tabindex");
			});
		}
	}

	// Event listeners
	menuToggle.addEventListener("click", toggleMenu);

	// Close menu when pressing Escape key
	window.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && navMenu.classList.contains("active")) {
			closeMenu();
			// Return focus to menu button
			menuToggle.focus();
		}
	});

	// Trap focus within menu when open
	navMenu.addEventListener("keydown", (e) => {
		if (e.key === "Tab" && navMenu.classList.contains("active")) {
			const focusableElements = navMenu.querySelectorAll("a, button");
			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			if (e.shiftKey && document.activeElement === firstElement) {
				e.preventDefault();
				menuToggle.focus();
			} else if (!e.shiftKey && document.activeElement === lastElement) {
				e.preventDefault();
				menuToggle.focus();
			}
		}
	});

	// Handle resize events
	window.addEventListener("resize", () => {
		if (window.innerWidth > 1165 && navMenu.classList.contains("active")) {
			closeMenu();
		}
		setInitialMenuState();
	});

	// Initialize menu state
	setInitialMenuState();
});
