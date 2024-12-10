// Event listeners for martial arts buttons
document.addEventListener("DOMContentLoaded", () => {
    // Check if we're on index.html
    if (window.location.pathname.includes("index.html")) {
        // Define a mapping of martial art names to their corresponding colors
        const martialArts = {
            "Boxing": "red",
            "Karate": "silver",
            "Muay Thai": "orange",
            "Judo": "blue",
            "BJJ": "purple",
            "Wrestling": "gold"
        };

        // Add event listeners to buttons
        Object.keys(martialArts).forEach(art => {
            // Find the button element using a dynamic class selector
            document.querySelector(`.button-${art.toLowerCase().replace(" ", "")}`)
                .addEventListener("click", () => {
                    // Store martial art details in session storage
                    sessionStorage.setItem("selectedMartialArt", art);
                    sessionStorage.setItem("selectedMartialArtColor", martialArts[art]);

                    // Redirect to search.html
                    window.location.href = "search.html";
                });
        });
    }

    // Check if we're on search.html
    if (window.location.pathname.includes("search.html")) {
        // Retrieve martial art details from session storage
        const selectedArt = sessionStorage.getItem("selectedMartialArt");
        const selectedColor = sessionStorage.getItem("selectedMartialArtColor");

        // Update the page with the selected martial art details if available
        if (selectedArt && selectedColor) {
            const artElement = document.getElementById("selected-martial-art"); // Get the element for martial art title
            artElement.textContent = selectedArt; // Set the martial art name as the text content
            artElement.style.color = selectedColor; // Apply the corresponding color to the text
        }
    }
});
