// ratingRoutes.js under routes folder
const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

router.post('/', ratingController.createRating);
router.get('/ratings/user/:userId', ratingController.getRatingsByUserId);
router.get('/:buyerId/:catchId?', ratingController.getBuyerRatings);
//router.post('/updateBuyerRated', ratingController.updateBuyerRated); // Changed to handle POST requests
module.exports = router;
