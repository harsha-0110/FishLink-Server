// routes/chatRoutes.js

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
// @route   POST api/sendMessage
// @desc    Send a message
// @access  Public
router.post('/sendMessage', chatController.sendMessage);

// @route   GET api/chat/:senderId/:catchId
// @desc    Get chat history between a user and a catch
// @access  Public
router.get('/chat/:senderId/:catchId', chatController.getChatMessages);



// Route for fetching winner details by catchId
router.get('/win_details/:id', chatController.win_details);

module.exports = router;
