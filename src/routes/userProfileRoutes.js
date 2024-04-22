// userProfileRoutes.js
const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');

// Route to fetch user profile
router.get('/userProfile/seller/:sellerId', userProfileController.getUserProfile); // Use :sellerId as a parameter in the URL


// Route to fetch buyer profile
router.get('/userProfile/buyer/:buyerId', userProfileController.getBuyerProfile); // Use :buyerId as a parameter in the URL


module.exports = router;
