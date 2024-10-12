const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose(); // Import sqlite3
const app = express();
const PORT = 4000;

// Middleware to parse JSON request bodies
app.use(express.json()); 
app.use(cors());

// Create or open the database
const db = new sqlite3.Database('./auth.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the auth database.');
    
    // Create users table if it doesn't exist
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT NOT NULL
      )`, (err) => {
        if (err) {
          console.error('Error creating users table:', err.message);
        } else {
          console.log('Users table created or already exists.');
        }
      });
    });
  }
});

// API to register a new user
app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;

  // Insert new user into the users table
  const query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
  db.run(query, [username, password, email], function (err) {
    if (err) {
      console.error('Error registering user:', err.message);
      return res.status(500).json({ message: 'Error registering user' });
    }
    console.log(`User registered with ID: ${this.lastID}`); // Log the new user's ID
    res.status(201).json({ id: this.lastID, username, email }); // Respond with the new user's ID and details
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
