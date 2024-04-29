// Catch.js under models folder
const mongoose = require('mongoose');

const CatchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    images: {
        type: [String], // Array of image URLs
    },
    location: {
        type: String,
        required: true
    },
    basePrice: {
        type: Number,
        required: true
    },
    currentBid: {
        type: Number,
        required: true
    },
    highestBidder: {
        type: String
    },
    quantity: {
        type: Number,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'expired'], // Example status options
        default: 'available'
    },
    buyerRated: {
        type: Boolean,
        default: false // Indicates whether the buyer has been rated by the seller
    }
    
});

const Catch = mongoose.model('Catch', CatchSchema);

module.exports = Catch;
