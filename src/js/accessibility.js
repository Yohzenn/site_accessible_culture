/**
 * Accessibility JavaScript
 * Enhances website accessibility by providing additional features
 * and handling accessibility concerns
 */

class AccessibilityManager {
	constructor() {
		this.initAccessibilityFeatures();
		this.initAccessibilityMenu();
		this.handleCardAccessibility();
	}

	/**
	 * Initialize basic accessibility features
	 */
	initAccessibilityFeatures() {
		// Ensure all images have alt attributes
		document.querySelectorAll("img:not([alt])").forEach((img) => {
			console.warn("Image without alt attribute:", img);
			img.alt = ""; // Empty alt for decorative images
		});

		// Ensure form elements have labels
		document.querySelectorAll("input, select, textarea").forEach((field) => {
			if (!field.id || !document.querySelector(`label[for="${field.id}"]`)) {
				console.warn("Form field without associated label:", field);
			}
		});

		// Add role="button" to elements that function as buttons but aren't <button>
		document.querySelectorAll(".btn:not(button):not(a[href])").forEach((el) => {
			el.setAttribute("role", "button");
			el.setAttribute("tabindex", "0");
		});

		// Ensure proper heading structure
		this.checkHeadingStructure();

		// Improve card announcements for screen readers
		this.improveCardAnnouncements();

		// Add keydown event for Escape key to close dialogs/modals
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				// Close any open modals/dialogs
				const modals = document.querySelectorAll(
					'[role="dialog"][aria-modal="true"]'
				);
				modals.forEach((modal) => modal.setAttribute("hidden", "true"));
			}
		});
	}

	/**
	 * Check heading structure for proper hierarchy
	 */
	checkHeadingStructure() {
		const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
		let previousLevel = 0;

		headings.forEach((heading) => {
			const currentLevel = parseInt(heading.tagName.charAt(1));

			// Log warning for skipped heading levels (only in development)
			if (currentLevel > previousLevel + 1 && previousLevel !== 0) {
				console.warn("Heading structure issue: Skipped heading level", heading);
			}

			previousLevel = currentLevel;
		});
	}

	/**
	 * Improve card announcements for screen readers by reducing redundancy
	 */
	improveCardAnnouncements() {
		// Fix redundant announcements in article cards
		document
			.querySelectorAll(
				".article-card, .event-card, .projet-card, .magazine-card"
			)
			.forEach((card) => {
				// Ensure cards aren't focusable to prevent double-focus issues
				card.removeAttribute("tabindex");

				// Make sure the card link is the only focusable element in the card
				const link = card.querySelector("a");
				if (link) {
					// Improve link labeling if needed
					if (!link.getAttribute("aria-label")) {
						const heading = card.querySelector("h3");
						if (heading) {
							const additionalInfo = [];

							// Add category if available
							const tag = card.querySelector(".tag");
							if (tag) additionalInfo.push(tag.textContent);

							// Add date if available
							const time = card.querySelector("time");
							if (time) additionalInfo.push(time.textContent);

							// Add status if available
							const status = card.querySelector(".status");
							if (status) additionalInfo.push(status.textContent);

							// Create accessible label
							if (additionalInfo.length > 0) {
								link.setAttribute(
									"aria-label",
									`${heading.textContent} - ${additionalInfo.join(", ")}`
								);
							}
						}
					}
				}
			});
	}

	/**
	 * Initialize accessibility menu (triggered by footer link)
	 */
	initAccessibilityMenu() {
		const accessibilityLink = document.getElementById("accessibility-link");
		if (accessibilityLink) {
			accessibilityLink.addEventListener("click", (e) => {
				e.preventDefault();
				this.showAccessibilityOptions();
			});
		}
	}

	/**
	 * Handle accessibility for card components
	 */
	handleCardAccessibility() {
		// Make sure all cards with links are properly navigable
		const cards = document.querySelectorAll(
			".article-card, .event-card, .projet-card, .magazine-card"
		);

		cards.forEach((card) => {
			// If card has a main link, make sure pressing Enter on the card activates it
			const cardLink = card.querySelector("a.card-link");
			if (cardLink) {
				// For cards with a wrapping link, ensure proper keyboard accessibility
				card.addEventListener("keydown", (e) => {
					if (e.key === "Enter" && document.activeElement === card) {
						e.preventDefault();
						cardLink.click();
					}
				});
			}
		});
	}

	/**
	 * Show accessibility options dialog
	 */
	showAccessibilityOptions() {
		// This is a placeholder for an accessibility options dialog
		// In a real implementation, this would show a modal with accessibility settings
		alert("Options d'accessibilité seront disponibles prochainement.");

		// Example options that could be included:
		// - Text size adjustment
		// - Contrast settings
		// - Motion reduction
		// - Font adjustments for dyslexia
	}
}

// Initialize the accessibility manager
document.addEventListener("DOMContentLoaded", () => {
	const accessibilityManager = new AccessibilityManager();
});

/**
 * Setup accessibility panel
 */
function setupAccessibilityPanel() {
	const accessibilityLink = document.getElementById("accessibility-link");
	if (accessibilityLink) {
		accessibilityLink.addEventListener("click", function (e) {
			e.preventDefault();
			toggleAccessibilityPanel();
		});
	}
}

/**
 * Toggle accessibility panel
 */
function toggleAccessibilityPanel() {
	let panel = document.getElementById("accessibility-panel");

	if (!panel) {
		panel = createAccessibilityPanel();
		document.body.appendChild(panel);
	}

	if (panel.hasAttribute("hidden")) {
		panel.removeAttribute("hidden");
		panel.querySelector("button").focus();
	} else {
		panel.setAttribute("hidden", "true");
	}
}

/**
 * Create accessibility panel with font size and contrast options
 */
function createAccessibilityPanel() {
	const panel = document.createElement("div");
	panel.id = "accessibility-panel";
	panel.role = "dialog";
	panel.setAttribute("aria-labelledby", "a11y-title");
	panel.setAttribute("aria-modal", "true");

	panel.innerHTML = `
        <div class="a11y-panel-content">
            <h2 id="a11y-title">Options d'accessibilité</h2>
            <button aria-label="Fermer le panneau d'accessibilité" class="close-panel">×</button>
            
            <div class="a11y-section">
                <h3>Taille de police</h3>
                <div class="a11y-controls">
                    <button data-action="font-smaller" aria-label="Réduire la taille de police">A-</button>
                    <button data-action="font-reset" aria-label="Taille de police par défaut">A</button>
                    <button data-action="font-larger" aria-label="Augmenter la taille de police">A+</button>
                </div>
            </div>
            
            <div class="a11y-section">
                <h3>Contraste</h3>
                <div class="a11y-controls">
                    <button data-action="contrast-normal" aria-label="Contraste normal">Normal</button>
                    <button data-action="contrast-high" aria-label="Contraste élevé">Élevé</button>
                </div>
            </div>
        </div>
    `;

	// Add close button functionality
	panel.querySelector(".close-panel").addEventListener("click", () => {
		panel.setAttribute("hidden", "true");
	});

	// Add font size controls
	panel
		.querySelector("[data-action='font-smaller']")
		.addEventListener("click", () => {
			adjustFontSize(-1);
		});

	panel
		.querySelector("[data-action='font-reset']")
		.addEventListener("click", () => {
			resetFontSize();
		});

	panel
		.querySelector("[data-action='font-larger']")
		.addEventListener("click", () => {
			adjustFontSize(1);
		});

	// Add contrast controls
	panel
		.querySelector("[data-action='contrast-normal']")
		.addEventListener("click", () => {
			document.body.classList.remove("high-contrast");
			localStorage.setItem("contrast", "normal");
		});

	panel
		.querySelector("[data-action='contrast-high']")
		.addEventListener("click", () => {
			document.body.classList.add("high-contrast");
			localStorage.setItem("contrast", "high");
		});

	return panel;
}

/**
 * Adjust font size
 */
function adjustFontSize(step) {
	const currentSize = parseInt(
		localStorage.getItem("fontSizeAdjustment") || "0"
	);
	const newSize = Math.min(Math.max(currentSize + step, -2), 4); // Limit range from -2 to 4

	localStorage.setItem("fontSizeAdjustment", newSize.toString());
	applyFontSize(newSize);
}

/**
 * Reset font size to default
 */
function resetFontSize() {
	localStorage.setItem("fontSizeAdjustment", "0");
	applyFontSize(0);
}

/**
 * Apply font size adjustment
 */
function applyFontSize(sizeAdjustment) {
	const baseSize = 16; // Base font size in pixels
	const newSize = baseSize * (1 + sizeAdjustment * 0.1);
	document.documentElement.style.fontSize = `${newSize}px`;
}

// Initialize saved preferences
(function initSavedPreferences() {
	// Apply saved font size
	const savedFontSize = localStorage.getItem("fontSizeAdjustment");
	if (savedFontSize !== null) {
		applyFontSize(parseInt(savedFontSize));
	}

	// Apply saved contrast
	if (localStorage.getItem("contrast") === "high") {
		document.body.classList.add("high-contrast");
	}
})();
