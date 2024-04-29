// sellerRatingRoutes.js

const express = require('express');
const router = express.Router();
const sellerRatingController = require('../controllers/sellerRatingController');

// Route to create a new seller rating
router.post('/', sellerRatingController.createSellerRating);

// Route to get ratings for a specific seller
router.get('/:sellerId', sellerRatingController.getSellerRatings);

module.exports = router;
