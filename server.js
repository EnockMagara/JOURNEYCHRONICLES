import express from 'express'; // Import Express
import path from 'path'; // Import path module for handling file paths
import { fileURLToPath } from 'url'; // Import to handle file URLs
import bodyParser from 'body-parser'; // Import body-parser for parsing request bodies
import session from 'express-session'; // Import express-session
import indexRouter from './routes/index.js'; // Import index route
import uploadRouter from './routes/upload.js'; // Import upload route
import authRouter from './routes/auth.js'; // Import auth route
import adminRouter from './routes/admin.js'; // Import admin route
import fs from 'fs'; // Import fs module for file system operations

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

// Set up session middleware
app.use(session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

// Allow access to login and sign-up routes without authentication
app.use(authRouter); 

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}

// Use the middleware to protect routes
app.use('/', isAuthenticated, indexRouter);
app.use('/upload', isAuthenticated, uploadRouter);
app.use('/admin', isAuthenticated, adminRouter);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/map', (req, res) => {
    const dataPath = path.join(__dirname, 'uploads/data.json');

    fs.readFile(dataPath, (err, content) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(500).send('Error reading data');
        }

        let files;
        try {
            files = JSON.parse(content);
            // Filter only approved files
            files = files.filter(file => file.status === 'approved');
        } catch (parseErr) {
            console.error('Error parsing data:', parseErr);
            files = [];
        }

        res.render('map', { files }); // Pass only approved files to the map view
    });
});
