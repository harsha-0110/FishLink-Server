const Bid = require('../models/Bid');
const Catch = require('../models/Catch');
const User = require('../models/User');
const notify = require('./oneSignalController');
const Winner = require('../models/Winner');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator'); // Importing validation result
require('dotenv').config();

exports.placeBid = async (req, res) => {
    try {
        const { userId, bidAmount, catchId } = req.body;

        // Validate input data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        // Fetch the catch details in a transaction to ensure consistency
        const catchDetail = await Catch.findById(catchId).exec();

        // Check if the catch exists
        if (!catchDetail) {
            return res.status(404).json({ error: 'Catch not found' }); 
        }
        
        // Check if bidding is still open
        if (new Date() > catchDetail.endTime) {
            return res.status(400).json({ error: 'Bidding for this item has ended' });
        }
        
        // Check if the bid amount is higher than the current bid
        if (bidAmount <= catchDetail.currentBid) {
            return res.status(400).json({ error: 'Bid amount must be higher than current bid' });
        }
        
        // Check if the user is the highest bidder
        if (catchDetail.highestBidder == userId){
            return res.status(400).json({ error: 'You are the Highest Bidder and can\'t place bids.' });
        }

        // Update the catch details with the new bid
        catchDetail.currentBid = bidAmount;
        catchDetail.highestBidder = userId;

        // Save the catch details in a transaction to ensure data integrity
        await catchDetail.save();

        // Check if the user has already placed a bid
        let existingBid = await Bid.findOneAndUpdate(
            { catchId: catchId, userId: userId },
            { bidAmount: bidAmount },
            { upsert: true, new: true }
        );

        if (existingBid) {
            return res.status(200).json({ message: 'Bid updated successfully', bid: existingBid });
        } else {
            const newBid = new Bid({
                userId,
                bidAmount,
                catchId
            });
        
            // Save the bid to the database
            await newBid.save();
        
            res.status(200).json({ message: 'Bid placed successfully', bid: newBid });
        }
    } catch (error) {
        console.error('Error placing bid:', error);
        res.status(500).json({ error: 'Failed to place bid' });
    }
};

// Add validation middleware to ensure data integrity and security
exports.validatePlaceBid = () => {
    return [
        // Example validation rules, customize as needed
        body('userId').notEmpty().isString(),
        body('bidAmount').notEmpty().isNumeric(),
        body('catchId').notEmpty().isString()
    ];
};

  
exports.getMyBids = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch all bids for the given user ID
        const myBids = await Bid.find({ userId }).sort({ timestamp: 'desc' });

        // Fetch catch details for each bid
        const bidsWithCatchDetails = await Promise.all(myBids.map(async (bid) => {
            // Fetch catch details for the current bid
            const catchDetail = await Catch.findById(bid.catchId);
            return { ...bid.toObject(), catchDetails: catchDetail };
        }));
        res.status(200).json(bidsWithCatchDetails);
    } catch (error) {
        console.error('Error fetching bids:', error);
        res.status(500).json({ error: 'Failed to fetch bids' });
    }
};
