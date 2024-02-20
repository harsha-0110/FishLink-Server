// catch.js under models folder
const mongoose = require('mongoose');

const CatchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    images: {
        type: [String], // Array of image URLs
        required: true
    },
    location: {
        type: String,
        required: true
    },
    basePrice: {
        type: Number,
        required: true
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
    }
});

const Catch = mongoose.model('Catch', CatchSchema);

module.exports = Catch;
