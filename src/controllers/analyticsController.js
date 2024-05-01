const Catch = require('../models/Catch');
const Rating = require('../models/Rating');
const Bid = require('../models/Bid');
const SellerRating = require('../models/sellerRating');
const { ObjectId } = require('mongodb');

exports.analytics = async (req, res) => {
    const sellerId = req.params.sellerId;

  try {
    // Fetch analytics data specific to the seller from the database
    const totalCatches = await Catch.countDocuments({ seller: sellerId });
    const activeCatches = await Catch.countDocuments({ seller: sellerId, status: 'available' });
    const soldCatches = await Catch.countDocuments({ seller: sellerId, status: 'sold' });
    const expiredCatches = await Catch.countDocuments({ seller: sellerId, status: 'expired' });

    const totalRevenueResult = await Catch.aggregate([
      {
        $match: {seller:  new ObjectId(sellerId), status: 'sold' }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$currentBid" }
        }
      }
    ]);

    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;
    
    // Fetch average rating from SellerRating model
    const sellerRatings = await SellerRating.find({ ratedSellerId: sellerId });
    let totalRating = 0;
    sellerRatings.forEach((rating) => {
      totalRating += rating.rating;
    });
    const ratings = sellerRatings.length > 0 ? (totalRating / sellerRatings.length).toFixed(1) : 0;

    // Send the analytics data back to the client
    res.json({
      totalCatches,
      activeCatches,
      soldCatches,
      expiredCatches,
      totalRevenue,
      ratings
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.buyerAnalytics = async (req, res) => {
  //console.log("done")
    try {
        const { buyerId } = req.params;
        

        // Fetch all bids made by the buyer
        const buyerBids = await Bid.find({ userId: buyerId });

        // Fetch all catches won by the buyer
        const buyerWonCatches = await Catch.find({ highestBidder: buyerId });

        // Calculate the number of bids placed by the buyer
        const numBidsPlaced = buyerBids.length;

        // Calculate the number of bids won by the buyer
        const numBidsWon = buyerWonCatches.length;

        // Calculate the average spending of the buyer
        let totalSpending = 0;
        buyerBids.forEach(bid => {
            totalSpending += bid.bidAmount;
        });
        const averageSpending = totalSpending / numBidsPlaced;

        // Find the most and least amount spent by the buyer
        const sortedBids = buyerBids.sort((a, b) => a.bidAmount - b.bidAmount);
        const mostAmountSpent = sortedBids[sortedBids.length - 1]?.bidAmount || 0;
        const leastAmountSpent = sortedBids[0]?.bidAmount || 0;

        // Fetch all ratings given to the buyer
        const buyerRatings = await Rating.find({ userId: buyerId });
        
       // console.log(buyerId);

        // Return the analytics data
        res.json({
            buyerId,
            bidsPlaced: numBidsPlaced,
            bidsWon: numBidsWon,
            averageSpending,
            mostAmountSpent,
            leastAmountSpent,
            ratings: buyerRatings
            // Add more analytics data here if needed
        });
        
    } catch (error) {
        console.error('Error fetching buyer analytics:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
