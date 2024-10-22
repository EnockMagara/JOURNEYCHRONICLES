import express from 'express';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt'; // For hashing passwords
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

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const usersPath = path.join(__dirname, '../uploads/users.json');

    fs.readFile(usersPath, (err, content) => {
        if (err) {
            console.error('Error reading users data:', err);
            return res.status(500).send('Error reading users data');
        }
        const users = JSON.parse(content);
        const hashedPassword = bcrypt.hashSync(password, 10);
        users.push({ username, password: hashedPassword, role: 'user' });
        fs.writeFile(usersPath, JSON.stringify(users), (err) => {
            if (err) {return res.status(500).send('Error saving user');}
            res.redirect('/login'); // Redirect to login page after successful sign-up
        });
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const usersPath = path.join(__dirname, '../uploads/users.json');

    fs.readFile(usersPath, (err, content) => {
        if (err) {return res.status(500).send('Error reading users data');}
        const users = JSON.parse(content);
        const user = users.find(u => u.username === username);
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = { username: user.username, role: user.role }; // Store user info in session
            res.redirect('/');
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
