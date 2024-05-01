// userProfileRoutes.js
const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');

// Route to fetch seller profile
router.get('/userProfile/user/:userId', userProfileController.getUserProfile); // Use :sellerId as a parameter in the URL

// Route to update user profile
router.post('/userProfile/update/:userId', userProfileController.updateUserProfile); // Use :userId as a parameter in the URL

// Route to search for users
router.get('/userProfile/search', userProfileController.searchUsers);


module.exports = router;
