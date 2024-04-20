const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// @route   GET api/catch/available
// @desc    Get available catches
// @access  Public (or whichever access level is appropriate)
// Seller analytics route
router.get('/analytics/:sellerId', analyticsController.analytics);

// Buyer analytics route
router.get('/analytics/buyer/:buyerId', analyticsController.buyerAnalytics);

module.exports = router;