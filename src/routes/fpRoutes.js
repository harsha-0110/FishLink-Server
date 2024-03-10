const express = require('express');
const router = express.Router();
const fpController = require('../controllers/fpController');

// @route   POST api/forgot-password
// @desc    Forgot Password Mail sender
// @access  Private (User only)
router.post('/forgot-password', fpController.forgotPassword);

// @route   POST api/reset-password/:token
// @desc    Reset Password
// @access  Private (User only)
router.post('/reset-password/:token', fpController.resetPassword);

module.exports = router;