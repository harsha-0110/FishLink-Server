const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const catchController = require('../controllers/catchController');

// @route   POST api/signup
// @desc    Register user
// @access  Public
router.post('/signup', authController.signup);

// @route   POST api/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// @route   GET api//verify/:token
// @desc    Verify Email
// @access  Public
router.get('/verify/:token', authController.verifyAccount);


router.post('/add-catch', catchController.addCatch);

module.exports = router;
