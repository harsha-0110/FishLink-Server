const Bid = require('../models/Bid');
const Catch = require('../models/Catch');
require('dotenv').config();

exports.placeBid = async (req, res) => {
    try {
        const { userId, bidAmount, catchId } = req.body;
        
        // Find the catch details
        const catchDetail = await Catch.findById(catchId);
        
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
        await catchDetail.save();

        // Check if the user has already placed a bid
        let existingBid = await Bid.findOne({ catchId: catchId, userId: userId });

        if (existingBid) {
            // If the user has already placed a bid, update the existing bid document
            existingBid.bidAmount = bidAmount;
            await existingBid.save();
            return res.status(200).json({ message: 'Bid updated successfully', bid: existingBid });
        } else {
            // If the user has not placed a bid, create a new bid document
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
