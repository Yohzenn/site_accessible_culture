// Function to scroll element into view when focused
function handleFocusScroll(element) {
	element.addEventListener("focus", () => {
		element.scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
	});
}

// Add focus management to all focusable elements
document.addEventListener("DOMContentLoaded", () => {
	// Get all focusable elements
	const focusableElements = document.querySelectorAll(
		'a, button, [tabindex="0"]'
	);

	// Add scroll behavior to each focusable element
	focusableElements.forEach((element) => {
		handleFocusScroll(element);
	});
});

/**
 * Focus Manager - Handles focus management for interactive elements
 */
document.addEventListener("DOMContentLoaded", function () {
	// Initialize the focus manager
	initFocusManager();
});

/**
 * Initialize the focus manager
 */
function initFocusManager() {
	// Fix focus traps in interactive components
	setupCarouselFocusManagement();

	// Ensure cards don't have redundant focus
	fixCardFocusIssues();

	// Add escape key functionality for nested elements
	setupEscapeKeyNavigation();
}

/**
 * Fix focus issues with cards (prevent double focus)
 */
function fixCardFocusIssues() {
	// Remove tabindex from all cards to prevent double focus
	document
		.querySelectorAll(
			".article-card, .event-card, .projet-card, .magazine-card"
		)
		.forEach((card) => {
			card.removeAttribute("tabindex");

			// Make sure only the card link is focusable
			const link = card.querySelector("a");
			if (link) {
				// Ensure the link encompasses the entire card content for better click target
				ensureLinkCoversCard(card, link);
			}
		});
}

/**
 * Ensure the card link covers the entire card for better usability
 */
function ensureLinkCoversCard(card, link) {
	// Apply appropriate styling via CSS class if needed
	link.classList.add("card-full-link");
}

/**
 * Setup carousel focus management to ensure keyboard navigation works properly
 */
function setupCarouselFocusManagement() {
	const carouselElements = document.querySelectorAll(".carousel");

	carouselElements.forEach((carousel) => {
		const slides = carousel.querySelectorAll(".slide");
		const controls = carousel.querySelectorAll("button");

		// Add keyboard navigation for carousel controls
		controls.forEach((control) => {
			control.addEventListener("keydown", function (e) {
				// Handle arrow keys for carousel navigation
				if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
					e.preventDefault();
					if (e.key === "ArrowLeft") {
						const prevButton = carousel.querySelector(".prev");
						if (prevButton) prevButton.click();
					} else {
						const nextButton = carousel.querySelector(".next");
						if (nextButton) nextButton.click();
					}
				}
			});
		});
	});
}

/**
 * Setup escape key navigation for interactive elements
 */
function setupEscapeKeyNavigation() {
	document.addEventListener("keydown", function (e) {
		// If Escape key is pressed
		if (e.key === "Escape") {
			// Check if we're in a dropdown or submenu
			const expandedElements = document.querySelectorAll(
				'[aria-expanded="true"]'
			);
			if (expandedElements.length) {
				e.preventDefault();
				// Collapse the last expanded element
				const lastExpanded = expandedElements[expandedElements.length - 1];
				lastExpanded.setAttribute("aria-expanded", "false");
			}
		}
	});
}

/**
 * Focus Manager - Manages focus for accessibility
 * Handles proper focus management between components and skip links
 */

class FocusManager {
	constructor() {
		this.focusableSelectors =
			'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"], .article-card[tabindex="0"], .event-card[tabindex="0"], .projet-card[tabindex="0"], .magazine-card[tabindex="0"]';
		this.lastFocusedElement = null;
		this.initSkipLinks();
		this.initCardFocusHandling();
	}

	/**
	 * Initialize skip link functionality
	 */
	initSkipLinks() {
		const skipLinks = document.querySelectorAll(".skip-link");

		skipLinks.forEach((link) => {
			link.addEventListener("click", (event) => {
				event.preventDefault();
				const targetId = link.getAttribute("href").substring(1);
				const targetElement = document.getElementById(targetId);

				if (targetElement) {
					// Set tabindex to ensure the element can receive focus
					targetElement.setAttribute("tabindex", "-1");
					targetElement.focus();

					// After focusing, we can reset the tabindex if it wasn't focusable before
					// But only if it doesn't already have a tabindex attribute
					if (!targetElement.hasAttribute("data-original-tabindex")) {
						setTimeout(() => {
							targetElement.removeAttribute("tabindex");
						}, 100);
					}

					// Scroll to the element for visual indication
					targetElement.scrollIntoView({ behavior: "smooth" });
				}
			});
		});
	}

	/**
	 * Initialize card focus handling
	 */
	initCardFocusHandling() {
		const cards = document.querySelectorAll(
			".article-card, .event-card, .projet-card, .magazine-card"
		);

		cards.forEach((card) => {
			// Make sure tabbing to a card focuses its main link
			card.addEventListener("focus", () => {
				const cardLink = card.querySelector("a");
				if (cardLink) {
					this.lastFocusedElement = cardLink;
				}
			});

			// Handle keyboard navigation within cards
			card.addEventListener("keydown", (event) => {
				// Enter key should activate the card's main link
				if (event.key === "Enter" && document.activeElement === card) {
					event.preventDefault();
					const cardLink = card.querySelector("a");
					if (cardLink) {
						cardLink.click();
					}
				}
			});
		});
	}

	/**
	 * Save the current focus state
	 */
	saveFocus() {
		this.lastFocusedElement = document.activeElement;
	}

	/**
	 * Restore the focus to the previously focused element
	 */
	restoreFocus() {
		if (this.lastFocusedElement) {
			this.lastFocusedElement.focus();
		}
	}

	/**
	 * Trap focus within a specific container
	 * @param {HTMLElement} container - The container to trap focus within
	 */
	trapFocus(container) {
		const focusableElements = container.querySelectorAll(
			this.focusableSelectors
		);
		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		container.addEventListener("keydown", (e) => {
			if (e.key === "Tab") {
				if (e.shiftKey && document.activeElement === firstElement) {
					e.preventDefault();
					lastElement.focus();
				} else if (!e.shiftKey && document.activeElement === lastElement) {
					e.preventDefault();
					firstElement.focus();
				}
			}
		});
	}
}

// Initialize the focus manager
const focusManager = new FocusManager();

// Export the focus manager for use in other modules
if (typeof module !== "undefined" && module.exports) {
	module.exports = focusManager;
}

/**
 * Make each card clickable to activate its main link
 */
function initializeCardInteractions() {
	const cardSelectors = [
		".article-card",
		".event-card",
		".projet-card",
		".magazine-card",
	];

	cardSelectors.forEach((selector) => {
		const cards = document.querySelectorAll(selector);

		cards.forEach((card) => {
			// Make the whole card activate its main link when clicked or Enter is pressed
			card.addEventListener("click", function (e) {
				// Only activate if the click was on the card itself, not its children
				if (e.target === card) {
					const mainLink = card.querySelector("a");
					if (mainLink) {
						// Simulate a click on the first link
						mainLink.click();
					}
				}
			});

			card.addEventListener("keydown", function (e) {
				// Activate on Enter key
				if (e.key === "Enter") {
					const mainLink = card.querySelector("a");
					if (mainLink) {
						mainLink.click();
					}
				}
			});
		});
	});
}

/**
 * Test that skip link is accessible and fix if needed
 */
function testSkipLinkAccess() {
	const skipLink = document.querySelector(".skip-link");
	if (!skipLink) return;

	// Test if the skip link is accessible via keyboard
	setTimeout(() => {
		// Ensure the skip link is in the tab order
		if (window.getComputedStyle(skipLink).display === "none") {
			console.error("Skip link is not accessible to keyboard users!");
			skipLink.style.display = "block";
			skipLink.style.opacity = "0";
		}

		// Test focus visibility
		skipLink.addEventListener("focus", () => {
			// Ensure opacity is set to 1 when focused
			skipLink.style.opacity = "1";
		});

		skipLink.addEventListener("blur", () => {
			// Return to invisible but still accessible
			skipLink.style.opacity = "0";
		});
	}, 1000);
}

/**
 * Initializes arrow key navigation within card groups
 */
function initializeCardNavigation() {
	const cardGroups = [
		document.querySelector(".articles"),
		document.querySelector(".events-grid"),
		document.querySelector(".projets-grid"),
		document.querySelector(".magazines-grid"),
	];

	cardGroups.forEach((cardGroup) => {
		if (!cardGroup) return;

		const cards = Array.from(cardGroup.children);
		if (cards.length === 0) return;

		cards.forEach((card, index) => {
			// Find the first focusable element in the card
			const firstFocusable = getFocusableElements(card)[0];
			if (!firstFocusable) return;

			firstFocusable.addEventListener("keydown", function (e) {
				let nextIndex;

				switch (e.key) {
					case "ArrowRight":
						nextIndex = (index + 1) % cards.length;
						navigateToCard(cards, nextIndex);
						e.preventDefault();
						break;

					case "ArrowLeft":
						nextIndex = (index - 1 + cards.length) % cards.length;
						navigateToCard(cards, nextIndex);
						e.preventDefault();
						break;

					case "ArrowDown":
						// Calculate next row
						const cardsPerRow = getCardsPerRow(cardGroup);
						nextIndex = (index + cardsPerRow) % cards.length;
						navigateToCard(cards, nextIndex);
						e.preventDefault();
						break;

					case "ArrowUp":
						// Calculate previous row
						const cardsPerRowUp = getCardsPerRow(cardGroup);
						nextIndex = (index - cardsPerRowUp + cards.length) % cards.length;
						navigateToCard(cards, nextIndex);
						e.preventDefault();
						break;
				}
			});
		});
	});
}

/**
 * Get all focusable elements inside an element
 */
function getFocusableElements(element) {
	return Array.from(
		element.querySelectorAll(
			'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
		)
	).filter(
		(el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
	);
}

/**
 * Navigate to a specific card
 */
function navigateToCard(cards, index) {
	const targetCard = cards[index];
	if (!targetCard) return;

	const focusableElements = getFocusableElements(targetCard);
	if (focusableElements.length > 0) {
		focusableElements[0].focus();
	}
}

/**
 * Calculate how many cards are in a row
 */
function getCardsPerRow(cardGroup) {
	if (!cardGroup || !cardGroup.children || cardGroup.children.length === 0)
		return 1;

	const firstCard = cardGroup.children[0];
	const cardRect = firstCard.getBoundingClientRect();
	const groupRect = cardGroup.getBoundingClientRect();

	// Calculate cards per row (allow for small rounding errors)
	return Math.max(1, Math.floor((groupRect.width + 5) / cardRect.width));
}

/**
 * Optional: Widen arrow buttons on small screens
 */
function adjustArrowButtonSize() {
	const prevButton = document.querySelector(".carousel-controls .prev");
	const nextButton = document.querySelector(".carousel-controls .next");

	if (window.innerWidth < 768 && prevButton && nextButton) {
		prevButton.style.width = "48px";
		prevButton.style.height = "48px";
		nextButton.style.width = "48px";
		nextButton.style.height = "48px";
	}
}

// Call this on resize and load
window.addEventListener("resize", adjustArrowButtonSize);
window.addEventListener("load", adjustArrowButtonSize);
