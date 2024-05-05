const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  catchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Catch',
    required: true,
  },
  winnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    default: 'initial', // Initial status
  },
});

const Winner = mongoose.model('Winner', winnerSchema);

module.exports = Winner;