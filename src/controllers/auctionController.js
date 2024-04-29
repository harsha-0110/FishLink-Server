const User = require('../models/User');
const Catch = require('../models/Catch');
const Winner = require('../models/Winner');
const notify = require('./oneSignalController');

async function processBidEnd(catchId) {
  try {
    const item = await Catch.findOne({ _id: catchId });
    if (!item) {
      console.warn(`Auction end: Item not found. ID: ${catchId}`);
      return;
    }

    let winnerId = null;

    if (item.highestBidder) {
      // Update catch status to 'sold' if there is a highest bidder
      await Catch.updateOne({ _id: catchId }, { $set: { status: 'sold' } });
      winnerId = item.highestBidder;
    } else {
      // Update catch status to 'expired' if there is no highest bidder
      await Catch.updateOne({ _id: catchId }, { $set: { status: 'expired' } });
      console.log(`Auction end: Item expired due to no highest bidder. ID: ${catchId}`);
      return;
    }

    // Find the winner
    const winner = await User.findOne({ _id: winnerId });

    // Store winner information in the database
    if (winner) {
      const newWinner = new Winner({ catchId, winnerId });
      await newWinner.save();
    }

    // Send notifications to the winner
    if (winner && winner.deviceId) {
      const playerId = [winner.deviceId];
      await notify.sendNotificationToSelectPlayers(
        "Congratulations!",
        `You won the auction for ${item.name}`,
        playerId
      );
    }

    // Optionally send notifications to other bidders
  } catch (error) {
    console.error("Error processing auction end for item:", catchId, error);
  }
}

module.exports = {
  processBidEnd
};

