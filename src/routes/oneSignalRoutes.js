const express = require('express');
const router = express.Router();
const oneSignalIdController = require('../controllers/oneSignalIdController');

// @route   POST /api/user/login
// @desc    Update the device ID when a user logs in
// @access  Public
router.post('/login', oneSignalIdController.loginUser);

// @route   POST /api/user/logout
// @desc    Clear the device ID when a user logs out
// @access  Public
router.post('/logout', oneSignalIdController.logoutUser);

module.exports = router;