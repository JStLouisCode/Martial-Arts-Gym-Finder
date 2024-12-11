document.addEventListener("DOMContentLoaded", () => {
    // Handle index.html
    if (window.location.pathname.includes("index.html")) {
        // Define martial arts and their respective colors
        const martialArts = {
            "Boxing": "red",
            "Karate": "silver",
            "Muay Thai": "orange",
            "Judo": "blue",
            "BJJ": "purple",
            "Wrestling": "gold"
        };

        // Add event listeners to each martial art button
        Object.keys(martialArts).forEach(art => {
            // Select the button dynamically using its class
            document.querySelector(`.button-${art.toLowerCase().replace(" ", "")}`)
                .addEventListener("click", () => {
                    // Store the selected martial art and its color in sessionStorage
                    sessionStorage.setItem("selectedMartialArt", art);
                    sessionStorage.setItem("selectedMartialArtColor", martialArts[art]);

                    // Redirect to search.html
                    window.location.href = "search.html";
                });
        });
    }

    // Handle search.html
    if (window.location.pathname.includes("search.html")) {
        // Retrieve the selected martial art and color from sessionStorage
        const selectedArt = sessionStorage.getItem("selectedMartialArt");
        const selectedColor = sessionStorage.getItem("selectedMartialArtColor");

        // Update the heading with the selected martial art and its color
        if (selectedArt && selectedColor) {
            const artElement = document.getElementById("selected-martial-art");
            artElement.textContent = selectedArt;
            artElement.style.color = selectedColor;
        }

        // Add event listener for the search button click
        const searchButton = document.getElementById("search-button");
        searchButton.addEventListener("click", async () => {
            // Gets the user's input from the search bar
            const searchInput = document.getElementById("search-input").value.trim();

            // If no input is provided, alert the user and exit
            if (!searchInput) {
                alert("Please enter a city or club name.");
                return;
            }

            try {
                // Sends a GET request to the backend with the selected martial art and user input
                const response = await fetch(`http://localhost:3000/gyms/search?style=${selectedArt}&location=${searchInput}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch gyms.");
                }

                // Parse the response as JSON
                const gyms = await response.json();

                // Update the HTML table with the results
                updateResultsTable(gyms);
            } catch (error) {
                // Handle errors during the fetch request
                alert("An error occurred while fetching gym data. Please try again.");
                console.error(error);
            }
        });
    }

    /**
     * Updates the results table with gym data from the backend.
     * @param {Array} gyms - Array of gym objects from the API response.
     */
    function updateResultsTable(gyms) {
        // Select the table body element
        const tableBody = document.querySelector("#results-table tbody");
        tableBody.innerHTML = ""; // Clear any existing rows

        // If no gyms are found, display a message in the table
        if (gyms.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 4; // Adjust colspan for the added organization column
            cell.textContent = "No gyms found.";
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        // Iterate over the gyms and create a row for each
        gyms.forEach(gym => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${gym.club_name}</td> <!-- Club name -->
                <td>${gym.city}</td> <!-- City -->
                <td>${gym.style}</td> <!-- Style -->
                <td>${gym.organization}</td> <!-- Organization -->
            `;
            tableBody.appendChild(row);
        });
    }
});


