// Fetching country codes and names for the select dropdown
const selectTags = document.querySelectorAll("select");

selectTags.forEach((tag, id) => {
	for (let country_code in countries) {
		let selected =
			id === 0
				? country_code === "en"
					? "selected"
					: ""
				: country_code === "es"
				? "selected"
				: "";

		let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
		tag.insertAdjacentHTML("beforeend", option);
	}
});

// Handling translation
document.getElementById("translateBtn").addEventListener("click", function () {
	const text = document.getElementById("inputText").value;
	const translateFrom = document.getElementById("translateFrom").value;
	const translateTo = document.getElementById("translateTo").value;
	translateText(text, translateFrom, translateTo);
});

function translateText(inputText, fromLang, toLang) {
	const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
		inputText
	)}&langpair=${fromLang}|${toLang}`;

	fetch(apiUrl)
		.then((response) => response.json())
		.then((data) => {
			if (data.responseData) {
				const translatedText = data.responseData.translatedText;
				const formattedText = removeQuestionMarks(translatedText);
				document.getElementById("outputText").innerText = formattedText;
			} else {
				document.getElementById("outputText").innerText =
					"Error: Could Not Translate!";
			}
		})
		.catch((error) => {
			console.error("Error:", error);
			document.getElementById("outputText").innerText =
				"Error: An error occurred while translating!";
		});
}

function removeQuestionMarks(text) {
	return text.replace(/^¿+|¿+$/g, "");
}

// Handling speech synthesis
document.getElementById("speakBtn").addEventListener("click", function () {
	const translatedText = document.getElementById("outputText").innerText;
	speakText(translatedText);
});

function speakText(text) {
	const speechSynthesis = window.speechSynthesis;
	const speechUtterance = new SpeechSynthesisUtterance(text);
	speechUtterance.lang = document.getElementById("translateTo").value;

	speechSynthesis.speak(speechUtterance);
}

// Dark mode toggle functionality
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

function enableDarkMode() {
	body.classList.add("dark-mode");
	localStorage.setItem("darkModeState", "enabled");
}

function disableDarkMode() {
	body.classList.remove("dark-mode");
	localStorage.setItem("darkModeState", "disabled");
}

// Initialize the dark mode state
const savedDarkModeState = localStorage.getItem("darkModeState");
if (savedDarkModeState === "enabled") {
	enableDarkMode();
	darkModeToggle.checked = true;
} else {
	disableDarkMode();
	darkModeToggle.checked = false;
}

darkModeToggle.addEventListener("change", function () {
	if (darkModeToggle.checked) {
		enableDarkMode();
	} else {
		disableDarkMode();
	}
});
