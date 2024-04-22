// userProfileRoutes.js
const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');

// Route to fetch user profile
router.get('/userProfile/seller/:sellerId', userProfileController.getUserProfile); // Use :sellerId as a parameter in the URL

module.exports = router;
