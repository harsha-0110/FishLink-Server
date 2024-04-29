// userProfile.js
const User = require('../models/User');
const Catch = require('../models/Catch');
const Rating = require('../models/Rating');
const Bid = require('../models/Bid');
const path = require('path');
const fs = require('fs');

// Controller function to fetch seller profile
exports.getUserProfile = async (req, res) => {
  const userId = req.params.sellerId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const catches = await Catch.find({ seller: userId });
    const ratings = await Rating.find({ userId: userId });

    const userProfile = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      bio: user.bio,
      harbour: user.harbour,
      profilePic: user.profilePic ? `${process.env.SURL}${user.profilePic}` : null, // Include profile picture URL if available
      catches,
      ratings
      // Add other relevant details as needed
    };

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBuyerProfile = async (req, res) => {
  const userId = req.params.buyerId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bids = await Bid.find({ userId: userId });
    const ratings = await Rating.find({ userId: userId });

    const buyerProfile = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      bio: user.bio,
      harbour: user.harbour,
      profilePic: user.profilePic ? `${process.env.SURL}${user.profilePic}` : null, // Include profile picture URL if available
      bids,
      ratings
      // Add other relevant details as needed
    };

    res.status(200).json(buyerProfile);
  } catch (error) {
    console.error("Error fetching buyer profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.updateUserProfile = async (req, res) => {
    const userId = req.params.userId;
    const { bio, harbour, profilePic } = req.body;
  
    try {
      // Find user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if there's an existing profile picture
      if (user.profilePic) {
        // Delete the old profile picture from the server
        const oldImagePath = path.join(__dirname, '../../uploads', userId, path.basename(user.profilePic));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
  
      // Update user's bio, harbour, and profile picture if available
      user.bio = bio;
      user.harbour = harbour;
  
      if (profilePic) {
        // Decode base64 profile picture
        const base64Data = profilePic.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
  
        // Generate unique filename
        const filename = `profile_${Date.now()}.png`; // You can use any desired extension
  
        // Specify path to save the profile picture
        const dirPath = path.join(__dirname, '../../uploads', userId);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        const imagePath = path.join(dirPath, filename);
  
        // Save the decoded profile picture to the server
        fs.writeFileSync(imagePath, buffer);
  
        // Update user's profile picture path
        user.profilePic = `/uploads/${userId}/${filename}`;
      }
  
      // Save updated user profile
      await user.save();
  
      // Respond with updated user profile data
      res.status(200).json(user);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


  exports.searchUsers = async (req, res) => {
  const query = req.query.q;
  try {
    const users = await User.find({
      $or: [
        { name: { $regex: new RegExp(query, 'i') } },
        { email: { $regex: new RegExp(query, 'i') } },
        { phone: { $regex: new RegExp(query, 'i') } },
      ],
    }).select('-password');

    const usersWithDetails = await Promise.all(users.map(async (user) => {
      

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        bio: user.bio,
        harbour: user.harbour,
        profilePic: user.profilePic ? `${process.env.SURL}${user.profilePic}` : null,
      };
    }));

    res.status(200).json(usersWithDetails);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
