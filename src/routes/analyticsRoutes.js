const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// @route   GET api/catch/available
// @desc    Get available catches
// @access  Public (or whichever access level is appropriate)
router.get('/analytics/:sellerId', analyticsController.analytics);

module.exports = router;