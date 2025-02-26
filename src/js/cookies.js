document.addEventListener("DOMContentLoaded", function () {
	const cookieConsent = document.getElementById("cookie-consent");
	const acceptBtn = document.getElementById("cookie-accept");
	const refuseBtn = document.getElementById("cookie-refuse");

	// Check if user has already made a choice
	if (!getCookie("cookieConsent")) {
		// Show cookie consent popup
		setTimeout(() => {
			cookieConsent.classList.add("visible");
			// Set focus to the cookie consent dialog
			cookieConsent.focus();
		}, 500);
	} else {
		// If cookies have been accepted, hide the popup completely
		cookieConsent.style.display = "none";
	}

	// Handle accept button click
	acceptBtn.addEventListener("click", function () {
		setCookieConsent("accept");
		hideCookieConsent();
	});

	// Handle refuse button click
	refuseBtn.addEventListener("click", function () {
		setCookieConsent("refuse");
		hideCookieConsent();
	});

	// Handle keyboard navigation within the cookie consent
	cookieConsent.addEventListener("keydown", function (e) {
		// If Escape key is pressed, hide the consent (same as refusing)
		if (e.key === "Escape") {
			setCookieConsent("refuse");
			hideCookieConsent();
		}
	});

	// Function to set cookie consent preference
	function setCookieConsent(value) {
		// Set cookie for 30 days
		const date = new Date();
		date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
		document.cookie = `cookieConsent=${value};expires=${date.toUTCString()};path=/;SameSite=Strict`;
	}

	// Function to hide cookie consent
	function hideCookieConsent() {
		cookieConsent.classList.remove("visible");
		// Completely remove from tab order by hiding it
		setTimeout(() => {
			cookieConsent.style.display = "none";
		}, 300); // Wait for transition to finish

		// Move focus to the first skip link after hiding consent
		const skipLink = document.querySelector(".skip-link");
		if (skipLink) {
			skipLink.focus();
		}
	}

	// Function to get cookie value by name
	function getCookie(name) {
		const match = document.cookie.match(
			new RegExp("(^| )" + name + "=([^;]+)")
		);
		return match ? match[2] : null;
	}
});

// Run immediately when script is loaded to ensure the cookie popup gets focus first
// ONLY if cookie consent has not been given
if (!getCookie("cookieConsent")) {
	// Check cookie consent first
	if (
		document.readyState === "complete" ||
		document.readyState === "interactive"
	) {
		// DOM already ready, focus immediately
		const cookieConsent = document.getElementById("cookie-consent");
		if (cookieConsent) {
			cookieConsent.classList.add("visible");
			setTimeout(() => cookieConsent.focus(), 0);
		}
	} else {
		// Set the cookie consent to be the first focused element
		window.addEventListener("load", function () {
			const cookieConsent = document.getElementById("cookie-consent");
			if (cookieConsent) {
				cookieConsent.classList.add("visible");
				cookieConsent.focus();
			}
		});
	}
} else {
	// If cookies have been accepted/refused, make sure the consent popup is not in the tab order
	window.addEventListener("DOMContentLoaded", function () {
		const cookieConsent = document.getElementById("cookie-consent");
		if (cookieConsent) {
			cookieConsent.style.display = "none";
		}
	});
}

// Helper function for the immediate check
function getCookie(name) {
	const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
	return match ? match[2] : null;
}
