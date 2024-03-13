// ratingRoutes.js under routes folder
const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

router.post('/', ratingController.createRating);
router.get('/:catchId', ratingController.getRatingsByCatchId);

module.exports = router;
