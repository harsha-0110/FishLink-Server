// sellerRating.js

const mongoose = require('mongoose');

const SellerRatingSchema = new mongoose.Schema({
    ratedSellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the seller who is being rated
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5 // Assuming a rating system from 1 to 5 stars
    },
    comment: {
        type: String
    },
    raterUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who is rating the seller
        required: true
    },
    catchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Catch', // Reference to the catch associated with the rating
        required: true
    }
}, { timestamps: true });

const SellerRating = mongoose.model('SellerRating', SellerRatingSchema);

module.exports = SellerRating;
