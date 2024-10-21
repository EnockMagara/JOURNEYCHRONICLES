import express from 'express'; // Import Express
import path from 'path'; // Import path module for handling file paths
import { fileURLToPath } from 'url'; // Import to handle file URLs
import bodyParser from 'body-parser'; // Import body-parser for parsing request bodies
import multer from 'multer'; // Import multer for handling file uploads
import indexRouter from './routes/index.js'; // Import index route
import uploadRouter from './routes/upload.js'; // Import upload route
import mapRouter from './routes/map.js'; // Import map route

const app = express(); // Create an Express application
const PORT = process.env.PORT || 3000; // Define the port

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the directory for static files
app.use(express.static(path.join(__dirname, 'public')));

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Files will be stored in the 'uploads' directory

// Use routes
app.use('/', indexRouter);
app.use('/upload', uploadRouter);
app.use('/map', mapRouter);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
