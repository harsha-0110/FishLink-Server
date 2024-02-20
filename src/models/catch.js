const mongoose = require('mongoose');

const CatchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    expectedPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
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
