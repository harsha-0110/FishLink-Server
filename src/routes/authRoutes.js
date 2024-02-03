const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST api/signup
// @desc    Register user
// @access  Public
router.post('/signup', authController.signup);

// @route   POST api/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

router.get('/verify/:token', authController.verifyAccount);

module.exports = router;
