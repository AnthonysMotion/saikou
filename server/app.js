const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { db } = require('./server'); // Import the db instance

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Fetch user from the database
        db.get(`SELECT * FROM users WHERE username = ? OR email = ?`, [username, username], async (err, row) => {
            if (err) {
                console.error('Error fetching user:', err.message);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
            if (!row) {
                return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }

            // Compare the password with the hash stored in the database
            const match = await bcrypt.compare(password, row.password);
            if (!match) {
                return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }

            // Successful login
            res.json({ success: true, user: { username: row.username } });
        });
    } catch (err) {
        console.error('Error logging in:', err.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    // Check if username or email already exists
    db.get(`SELECT * FROM users WHERE username = ? OR email = ?`, [username, email], async (err, row) => {
        if (err) {
            console.error('Error checking existing users:', err.message);
            return res.status(500).json({ message: 'Error checking existing users' });
        }

        if (row) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }

        // Hash the password
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            // Insert new user into the users table
            const query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
            db.run(query, [username, hashedPassword, email], function (err) {
                if (err) {
                    console.error('Error registering user:', err.message);
                    return res.status(500).json({ message: 'Error registering user' });
                }
                console.log(`User registered with ID: ${this.lastID}`);
                res.status(201).json({ id: this.lastID, username, email });
            });
        } catch (error) {
            console.error('Error hashing password:', error.message);
            return res.status(500).json({ message: 'Error registering user' });
        }
    });
});

module.exports = router; // Export the router
