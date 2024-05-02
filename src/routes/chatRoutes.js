// routes/chatRoutes.js

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// @route   POST api/sendMessage
// @desc    Send a message
// @access  Public
router.post('/sendMessage', chatController.sendMessage);

// @route   GET api/chat/:senderId/:receiverId
// @desc    Get chat history between two users
// @access  Public
router.get('/chat/:senderId/:receiverId', chatController.getChatMessages);


// Route for fetching winner details by catchId
router.get('/win_details/:id', chatController.win_details);

module.exports = router;
