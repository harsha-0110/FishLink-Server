const Catch = require('../models/Catch');

exports.analytics = async (req, res) => {
    const sellerId = req.params.sellerId;

  try {
    // Fetch analytics data specific to the seller from the database
    const totalCatches = await Catch.countDocuments({ seller: sellerId });
    const activeCatches = await Catch.countDocuments({ seller: sellerId, status: 'available' });
    const soldCatches = await Catch.countDocuments({ seller: sellerId, status: 'sold' });

    const totalRevenueResult = await Catch.aggregate([
      {
        $match: {status: 'sold' }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$currentBid" }
        }
      }
    ]);

    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

    // Calculate average rating (example implementation)
    const ratings = 4.5; // Assuming the average rating is 4.5

    // Send the analytics data back to the client
    res.json({
      totalCatches,
      activeCatches,
      soldCatches,
      totalRevenue,
      ratings
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
