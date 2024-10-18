import express from 'express'; // Import Express
import multer from 'multer'; // Import multer for handling file uploads
import path from 'path'; // Import path module
import { fileURLToPath } from 'url'; // Import fileURLToPath for getting the directory name
import fs from 'fs'; // Import fs for file system operations
import fetch from 'node-fetch'; // Import fetch for making HTTP requests
import dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Load environment variables

const router = express.Router(); // Create a router object

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer to store files in '../uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Use the correct path
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use a unique filename
    }
});

const upload = multer({ storage: storage }); // Configure multer with storage

// Define the GET route to render the upload page
router.get('/', (req, res) => {
    res.render('upload', { caption: '', location: '' });
});

// Define the POST route to handle file uploads
router.post('/', upload.single('photo'), async (req, res) => {
    const filePath = req.file.filename;
    const caption = req.body.caption;
    const location = req.body.location;

    // Use the API key from environment variables
    const apiKey = process.env.OPENCAGE_API_KEY;
    const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`;

    try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();
        const { lat, lng } = data.results[0].geometry;

        const imageData = { filePath, caption, latitude: lat, longitude: lng };
        const dataPath = path.join(__dirname, '../uploads/data.json');

        fs.readFile(dataPath, (err, content) => {
            let jsonData = [];
            if (!err) {
                jsonData = JSON.parse(content);
            }
            jsonData.push(imageData);
            fs.writeFile(dataPath, JSON.stringify(jsonData), (err) => {
                if (err) console.error(err);
                res.redirect('/');
            });
        });
    } catch (error) {
        console.error('Error geocoding location:', error);
        res.status(500).send('Error processing location');
    }
});

export default router; // Export the router
