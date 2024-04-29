//Bid.js
const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bidAmount: { type: Number, required: true },
  catchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Catch', required: true },
  timestamp: { type: Date, default: Date.now },
  isSellerRated: { type: Boolean, default: false }
});

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
