// sellerRatingController.js
const mongoose = require('mongoose');
const SellerRating = require('../models/sellerRating');
const User = require('../models/User');
const Catch = require('../models/Catch');
const Bid = require('../models/Bid');

// Function to create a new seller rating
exports.createSellerRating = async (req, res) => {
    try {
        // Extract necessary information from request body
        const { ratedSellerId, rating, comment, raterUserId, catchId } = req.body;
        console.log(ratedSellerId, rating, comment, raterUserId, catchId);

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(ratedSellerId) || !mongoose.Types.ObjectId.isValid(catchId)) {
            return res.status(400).json({ error: 'Invalid ObjectId' });
        }

        // Check if the rated seller exists
        const ratedSeller = await User.findById(ratedSellerId);
        if (!ratedSeller) {
            return res.status(404).json({ error: 'Rated seller not found' });
        }

        // Check if the rater user exists
        const raterUser = await User.findById(raterUserId);
        if (!raterUser) {
            return res.status(404).json({ error: 'Rater user not found' });
        }

        // Create a new seller rating object
        const newSellerRating = new SellerRating({
            ratedSellerId,
            rating,
            comment,
            raterUserId,
            catchId
        });

        // Save the seller rating to the database
        await newSellerRating.save();

        // Update the rated seller's isSellerRated to true
        ratedSeller.isSellerRated = true;
        await ratedSeller.save();

        // Update isSellerRated in Catch model
        const catchItem = await Catch.findById(catchId);
        if (catchItem) {
            catchItem.isSellerRated = true;
            await catchItem.save();
        }

        // Respond with success message
        res.status(201).json({ message: 'Seller rating created successfully', sellerRating: newSellerRating });
    } catch (error) {
        console.error('Error creating seller rating:', error);
        res.status(500).json({ error: 'Failed to create seller rating' });
    }
};


// Function to fetch ratings for a specific seller
exports.getSellerRatings = async (req, res) => {
    try {
        const { sellerId, catchId } = req.params;
        const query = { ratedSellerId: sellerId };
        if (catchId) {
            query.catchId = catchId;
        }
        const sellerRatings = await SellerRating.find(query);
        res.status(200).json(sellerRatings);
    } catch (error) {
        console.error('Error fetching seller ratings:', error);
        if (error.name === 'CastError') {
            res.status(400).json({ error: 'Invalid seller or catch ID' });
        } else {
            res.status(500).json({ error: 'Failed to fetch seller ratings' });
        }
    }
};




// // Function to fetch ratings for a specific seller
// exports.getSellerRatings = async (req, res) => {
//     try {
//         // Extract seller ID from request parameters
//         const { sellerId } = req.params;

//         // Fetch all ratings for the specified seller
//         const sellerRatings = await SellerRating.find({ ratedSellerId: sellerId });

//         // Respond with the seller ratings
//         res.status(200).json(sellerRatings);
//     } catch (error) {
//         console.error('Error fetching seller ratings:', error);
//         res.status(500).json({ error: 'Failed to fetch seller ratings' });
//     }
// };

