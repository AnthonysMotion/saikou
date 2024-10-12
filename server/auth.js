const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./server');
const router = express.Router();

router.post('/api/login', async (req, res) => {
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

module.exports = router;
