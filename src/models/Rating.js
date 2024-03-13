const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who is being rated (buyer)
        required: true
    },
    catchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Catch', // Reference to the catch for which the rating is being provided
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5 // Assuming a rating system from 1 to 5 stars
    },
    feedback: {
        type: String
    }
}, { timestamps: true });

const Rating = mongoose.model('Rating', RatingSchema);

module.exports = Rating;
