// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path for the database file
const dbPath = path.resolve(__dirname, 'auth.db');

// Create a new database instance
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database ' + err.message);
  } else {
    console.log('Connected to the auth.db database.');
    
    // Create the users table if it doesn't already exist
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table ' + err.message);
      } else {
        console.log('Users table created successfully.');
      }
    });
  }
});

// Close the database connection when done
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database ' + err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
