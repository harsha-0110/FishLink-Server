const express = require('express');
const router = express.Router();
const catchController = require('../controllers/catchController');

// @route   POST api/seller/add-catch
// @desc    Add a new catch
// @access  Private (Seller only)
router.post('/seller/add-catch', catchController.addCatch);

// @route   GET api/seller/catches
// @desc    Get all catches of a seller
// @access  Private (Seller only)
router.get('/seller/catches/:id', catchController.getCatchesBySeller);

// @route   GET api/catches
// @desc    Get all catches
// @access  Public
router.get('/catches', catchController.getAllCatches);

// @route   GET api/catch/:id
// @desc    Get a specific catch by ID
// @access  Public
router.get('/catch/:id', catchController.getCatchById);


// @route   PUT api/seller/edit-catch/:id
// @desc    Edit a specific catch by ID
// @access  Private (Seller only)
router.put('/seller/edit-catch/:id', catchController.editCatch);

// @route   DELETE api/seller/delete-catch/:id
// @desc    Delete a specific catch by ID
// @access  Private (Seller only)
router.get('/seller/delete-catch/:id', catchController.deleteCatch);

module.exports = router;