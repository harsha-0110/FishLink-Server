const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');

// @route   POST api/placeBid
// @desc    Place Bids
// @access  Public
router.post('/placeBid', bidController.placeBid);

// @route   POST api/my-bids/:userId
// @desc    Fetch my bids
// @access  Public
router.get('/my-bids/:userId', bidController.getMyBids);

module.exports = router;