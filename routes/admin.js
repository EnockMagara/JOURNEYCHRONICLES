import express from 'express'; // Import Express
import fs from 'fs'; // Import fs for file system operations
import path from 'path'; // Import path module for handling file paths
import { fileURLToPath } from 'url'; // Import fileURLToPath

const router = express.Router(); // Create a router object

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the GET route for the admin panel
router.get('/', (req, res) => { // Use '/' since it's mounted as '/admin'
    // Check if the user is logged in and is an admin
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send('Access denied'); // Deny access if not an admin
    }

    const dataPath = path.join(__dirname, '../uploads/data.json'); // Use __dirname
    fs.readFile(dataPath, (err, content) => {
        if (err) {return res.status(500).send('Error reading data');} // Handle read error
        const files = JSON.parse(content).filter(file => file.status === 'pending'); // Filter pending files
        res.render('admin', { files }); // Render the admin.ejs view with files
    });
});

// Define the POST route to approve a photo
router.post('/approve', (req, res) => {
    const { filePath } = req.body; // Get the file path from the request body
    const dataPath = path.join(__dirname, '../uploads/data.json'); // Path to the data file
    fs.readFile(dataPath, (err, content) => {
        if (err) {return res.status(500).send('Error reading data');} // Handle read error
        const files = JSON.parse(content); // Parse the JSON content
        const fileIndex = files.findIndex(file => file.filePath === filePath); // Find the file index
        if (fileIndex !== -1) {
            files[fileIndex].status = 'approved'; // Update the file status to approved
            fs.writeFile(dataPath, JSON.stringify(files), (err) => {
                if (err) {return res.status(500).send('Error updating data');} // Handle write error
                res.redirect('/admin'); // Redirect to the admin panel
            });
        } else {
            res.status(404).send('File not found'); // Handle file not found
        }
    });
});

export default router; // Export the router
