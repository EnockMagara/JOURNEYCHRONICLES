import express from 'express';
const router = express.Router();

// Route to render the map page
router.get('/', (req, res) => {
    res.render('map');
});

export default router;

