import express from 'express'; // Import Express
import fs from 'fs'; // Import file system module
import path from 'path'; // Import path module
import { fileURLToPath } from 'url'; // Import to handle file URLs

const router = express.Router(); // Create a router object

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the home route
router.get('/', (req, res) => {
    const dataPath = path.join(__dirname, '../uploads/data.json');

    fs.readFile(dataPath, (err, content) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading data');
        }
        let files;
        try {
            files = JSON.parse(content);
        } catch (parseErr) {
            console.error(parseErr);
            files = [];
        }
        res.render('index', { files });
    });
});

export default router; // Export the router
