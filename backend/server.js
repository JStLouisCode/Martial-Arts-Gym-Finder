// Import required modules
const express = require("express");  // Express framework to set up the server
const sqlite3 = require("sqlite3").verbose();  // SQLite3 to interact with the database
const cors = require("cors");  // CORS middleware to enable cross-origin requests (for frontend)

const app = express();  // Initialize the Express app

// Enable Cross-Origin Resource Sharing (CORS) to allow the frontend to make requests to the backend
app.use(cors());

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Connect to the SQLite database (adjust the path as necessary)
const db = new sqlite3.Database("../clubs.db", (err) => {
  if (err) {
    console.error("Error opening database", err);  // Log error if unable to connect to the database
  } else {
    console.log("Connected to the SQLite database");  // Log success if connected
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Martial Arts Gym Finder API!");
});


// API Endpoint: Search gyms by martial art style, location, and club name
app.get("/gyms/search", (req, res) => {
  // Extract query parameters (style, location, clubName) from the request
  const {id,  style, location, clubName } = req.query;

  // Validate that the required 'style' parameter is provided
  if (!style) {
    return res.status(400).json({ error: "Martial art style is required" });  // Return error if style is missing
  }

  // Start building the SQL query
  //let query = `SELECT * FROM clubs`;  // Base query to filter by style
  let query = `SELECT * FROM clubs WHERE style = ?`;  // Base query to filter by style
  let queryParams = [style];  // Initialize query parameters with the martial art style

  // Check if location is provided, and add it to the query
  if (location) {
    query += ` AND city LIKE ?`;  // Add a condition for location (city) using 'LIKE' for partial matching
    queryParams.push(`%${location.toLowerCase()}%`);  // Add the city to the parameters, ensuring case-insensitivity
  }

  // Check if club name is provided, and add it to the query
  if (clubName) {
    query += ` AND club_name LIKE ?`;  // Add a condition for club name using 'LIKE' for partial matching
    queryParams.push(`%${clubName}%`);  // Add the club name to the parameters
  }

  // Execute the query with the constructed parameters
   db.all(query, queryParams, (err, rows) => {
     if (err) {
       // Return an error response if the query fails
       return res.status(500).json({ error: err.message });
     }
   // If no results are found, return an empty array
    if (rows) {
      rows.forEach(row => {
        console.log(row.id);
      });
         // Return the search results as a JSON response
      res.json(rows);
    }else{
      return res.status(200).json([]);  // Respond with an empty array if no gyms match the query 
    }
 });
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);  // Log the server's running status and URL
});
