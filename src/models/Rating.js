//Rating.js
const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    ratedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who is being rated
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
    commenterUsername: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Rating = mongoose.model('Rating', RatingSchema);

module.exports = Rating;
