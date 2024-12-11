// Import required modules
const express = require("express");  // Express framework to set up the server (handles HTTP requests and responses)
const sqlite3 = require("sqlite3").verbose();  // SQLite3 to interact with database
const cors = require("cors");  // CORS middleware to enable cross-origin requests (for frontend)

const app = express();  // Initialize the Express app

// Enable Cross-Origin Resource Sharing (CORS) to allow the frontend to make requests to the backend API
app.use(cors());

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Connects to the SQLite database 
const db = new sqlite3.Database("../clubs.db", (err) => {
  if (err) {
    console.error("Error opening database", err);  // Logs error if unable to connect to the database
  } else {
    console.log("Connected to the SQLite database");  // Logs success if connected
  }
});

// Root route for the API
app.get("/", (req, res) => {
  res.send("Welcome to the Martial Arts Gym Finder API!"); // Simple message to confirm that the API is working
});


// API Endpoint: Search gyms by martial art style, location, and club name
app.get("/gyms/search", (req, res) => {
  // Extract query parameters (style, location, clubName) from the incoming request
  const {id,  style, location, clubName } = req.query;

  // Validates that the required 'style' parameter is provided
  if (!style) {
    return res.status(400).json({ error: "Martial art style is required" });  // Return error if style is missing
  }

  // Initializes the base SQL query and parameters for filtering gyms
  let query = `SELECT * FROM clubs WHERE style = ?`;  // Base query to filter by style
  let queryParams = [style];  // Initialize query parameters with the martial art style

  // Check if location is provided, and add it to the query
  if (location) {
    query += ` AND city LIKE ?`;  // Condition for location (city) using 'LIKE' for partial matching
    queryParams.push(`%${location.toLowerCase()}%`);  // Adds the city to the parameters, ensuring case-insensitivity
  }

  // Check if club name is provided, and add it to the query for filtering
  if (clubName) {
    query += ` AND club_name LIKE ?`;  // Condition for club name using 'LIKE' for partial matching
    queryParams.push(`%${clubName}%`);  // Adds the club name to the parameters
  }

  // Execute the query with the constructed parameters
   db.all(query, queryParams, (err, rows) => {
     if (err) {
       // Return an error response if the query fails
       return res.status(500).json({ error: err.message });
     }
   // If rows (results) are found, log IDs and return the data as JSON
    if (rows) {
      rows.forEach(row => {
        console.log(row.id); // Log each row's ID to the console for debugging
      });
      // Return the search results as a JSON response
      res.json(rows); 
    }
    else{
      // If no results are found, return an empty array with a 200 status
      return res.status(200).json([]);  
    }
 });
});

// Start the server on port 3000
const PORT = 3000; // Defines the port where the server will run
app.listen(PORT, () => {
  // Log a message to indicate the server is running and provide its URL
  console.log(`Server is running on http://localhost:${PORT}`);  
});
