const Bid = require('../models/Bid');
const Catch = require('../models/Catch');
require('dotenv').config();

exports.placeBid = async (req, res) => {
    try {
        const { userId, bidAmount, catchId } = req.body;
        const CatchDetail = await Catch.findOne({ _id: catchId });
        if (!CatchDetail) {
            return res.status(404).json({ error: 'Catch not found' }); 
        }
        if (bidAmount <= CatchDetail.currentBid) {
            return res.status(400).json({ error: 'Bid amount must be higher than current bid' });
        }
        if (CatchDetail.highestBidder == userId){
            return res.status(400).json({ error: 'You are the Higgest Bidder and can\'t place bids.' });
        }

        // Additional validations: 
        if (new Date() > CatchDetail.endTime) {
            return res.status(400).json({ error: 'Bidding for this item has ended' });
        }

        const updatedItem = await Catch.updateOne(
            { _id: catchId },
            { $set: { currentBid: bidAmount, highestBidder: userId } }
        );

        // Check if the user has already placed a bid
        const existingBid = await Bid.findOne({ catchId: catchId, userId: userId });

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
  
      const myBids = await Bid.find({ userId }).sort({ timestamp: 'desc' });
  
      res.status(200).json(myBids);
    } catch (error) {
      console.error('Error fetching bids:', error);
      res.status(500).json({ error: 'Failed to fetch bids' });
    }
  };