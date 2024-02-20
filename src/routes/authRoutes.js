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


// @route   POST api/seller/add-catch
// @desc    Add a new catch
// @access  Private (Seller only)
router.post('/seller/add-catch', catchController.addCatch);

// @route   GET api/seller/catches
// @desc    Get all catches of a seller
// @access  Private (Seller only)
router.get('/seller/catches', catchController.getCatchesBySeller);


module.exports = router;
