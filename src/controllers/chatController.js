// controllers/chatController.js
const ChatMessage = require('../models/chatMessage');
const Winner = require('../models/Winner');
const Catch = require('../models/Catch');

exports.sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;

        const newMessage = new ChatMessage({
            senderId,
            receiverId,
            message
        });

        await newMessage.save();

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

exports.getChatMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        const messages = await ChatMessage.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ timestamp: 'asc' });

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({ error: 'Failed to fetch chat messages' });
    }
};



exports.win_details = async (req, res) => {
    const catchId = req.params.id;

    try {
        console.log(catchId);
        const catchObj = await Catch.findById(catchId);

        if (!catchObj) {
            return res.status(404).json({ msg: 'Catch not found' });
        }

        const winner = await Winner.findOne({ catchId: catchId });

        if (!winner) {
            return res.status(404).json({ msg: 'Winner not found for this catch' });
        }

        // Sending winnerId, catchId, and sellerId in the response
        res.json({ winnerId: winner.winnerId, catchId: winner.catchId, sellerId: catchObj.seller });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

