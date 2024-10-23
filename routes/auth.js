import express from 'express';
import fs from 'fs';
import path from 'path';
import argon2 from 'argon2'; // Import argon2 for password hashing
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.get('/login', (req, res) => {
    res.render('login'); // Render the login.ejs view
});

router.get('/signup', (req, res) => {
    res.render('signup'); // Render the signup.ejs view
});

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const usersPath = path.join(__dirname, '../uploads/users.json');

    fs.readFile(usersPath, async (err, content) => {
        if (err) {
            console.error('Error reading users data:', err);
            return res.status(500).send('Error reading users data');
        }
        const users = JSON.parse(content);
        try {
            const hashedPassword = await argon2.hash(password); // Hash the password using argon2
            users.push({ username, password: hashedPassword, role: 'user' });
            fs.writeFile(usersPath, JSON.stringify(users), (err) => {
                if (err) {return res.status(500).send('Error saving user');}
                res.redirect('/login'); // Redirect to login page after successful sign-up
            });
        } catch (err) {
            console.error('Error hashing password:', err);
            res.status(500).send('Error processing request');
        }
    });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const usersPath = path.join(__dirname, '../uploads/users.json');

    fs.readFile(usersPath, async (err, content) => {
        if (err) {return res.status(500).send('Error reading users data');}
        const users = JSON.parse(content);
        const user = users.find(u => u.username === username);
        if (user) {
            try {
                if (await argon2.verify(user.password, password)) { // Verify the password using argon2
                    req.session.user = { username: user.username, role: user.role }; // Store user info in session
                    res.redirect('/');
                } else {
                    res.status(401).send('Invalid credentials');
                }
            } catch (err) {
                console.error('Error verifying password:', err);
                res.status(500).send('Error processing request');
            }
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/login'); // Redirect to login page after logout
    });
});

export default router;
