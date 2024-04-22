// userProfile.js
const User = require('../models/User');
const Catch = require('../models/Catch');
const Rating = require('../models/Rating');
const Bid = require('../models/Bid');

// Controller function to fetch user profile
exports.getUserProfile = async (req, res) => {
    const userId = req.params.sellerId; // Use req.params.sellerId to get the userId from the URL
  try {
    // Fetch user profile based on user ID from request object
    const user = await User.findById(userId); // Use userId instead of req.userId

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch user's catches
    const catches = await Catch.find({ seller: userId }); // Use userId instead of req.userId

    // Fetch user's ratings
    const ratings = await Rating.find({ userId: userId }); // Use userId instead of req.userId

    // Extract relevant user details
    const userProfile = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      catches,
      ratings
      // Add other relevant details as needed
    };

    // Send user profile data in response
    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBuyerProfile = async (req, res) => {
  const userId = req.params.buyerId; // Use req.params.buyerId to get the userId from the URL
try {
  // Fetch buyer profile based on user ID from request object
  const user = await User.findById(userId); // Use userId instead of req.userId

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Fetch buyer's bids
  const bids = await Bid.find({ userId: userId }); // Use userId instead of req.userId

  // Fetch buyer's ratings
  const ratings = await Rating.find({ userId: userId }); // Use userId instead of req.userId

  // Extract relevant buyer details
  const buyerProfile = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    userType: user.userType,
    bids,
    ratings
    // Add other relevant details as needed
  };

  // Send buyer profile data in response
  res.status(200).json(buyerProfile);
} catch (error) {
  console.error("Error fetching buyer profile:", error);
  res.status(500).json({ message: "Internal server error" });
}
};
