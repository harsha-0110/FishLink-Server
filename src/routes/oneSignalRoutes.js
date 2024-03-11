const express = require('express');
const router = express.Router();
const oneSignalController = require('../controllers/oneSignalController');


// @route   POST /api/user/login
// @desc    Update the device ID when a user logs in
// @access  Public
router.post('/login', oneSignalController.loginUser);

// @route   POST /api/user/logout
// @desc    Clear the device ID when a user logs out
// @access  Public
router.post('/logout', oneSignalController.logoutUser);




module.exports = router;