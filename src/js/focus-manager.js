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
