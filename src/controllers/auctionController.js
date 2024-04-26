const User = require('../models/User');
const Catch = require('../models/Catch');

const notify = require('./oneSignalController');

async function processBidEnd(catchId) {
    try {
      // 1. Update the status to 'sold' if there is a highest bidder
      const item = await Catch.findOne({ _id: catchId });
      if (item.highestBidder) {
        const updateResult = await Catch.updateOne(
          { _id: catchId },
          { $set: { status: 'sold' } }
        );

        if (updateResult.modifiedCount === 0) {
          console.warn(`Auction end: Item not found or already marked as sold. ID: ${catchId}`);
          return;
        }
      } else {
        // If there is no highest bidder, set the status to 'expired'
        await Catch.updateOne(
          { _id: catchId },
          { $set: { status: 'expired' } }
        );
        console.log(`Auction end: Item expired due to no highest bidder. ID: ${catchId}`);
        return;
      }
  
      // 2. Find the winner (highest bidder)
      const winnerId = item.highestBidder;
      const winner = await User.findOne({ _id: winnerId });
      
  
      // 3. Send notifications (using OneSignal)
      if (winner) {
        const playerId =  [winner.deviceId];
        if(playerId) {
          await notify.sendNotificationToSelectPlayers("Congratulations!", `You won the auction for ${item.name}`, playerId);
        }
      }
  
      // ... Optionally send notifications to other bidders
    } catch (error) {
      console.error("Error processing auction end for item:", catchId, error);
    }
}

module.exports = {
    processBidEnd
};
