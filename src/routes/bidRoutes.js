const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');

// @route   POST api/placeBid
// @desc    Place Bids
// @access  Public
router.post('/placeBid', bidController.placeBid);

module.exports = router;