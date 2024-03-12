const OneSignal = require('onesignal-node');
require('dotenv').config();

// OneSignal Client Setup
const client = new OneSignal.Client({
    userAuthKey: process.env.OSAPIKEY,
    app: { appAuthKey: process.env.OSAPIKEY, appId: process.env.OSAPPID }
});

// Function 1: Send notification to all players
async function sendNotificationToAllPlayers(title, message) {
    const notification = new OneSignal.Notification({
        contents: {
            en: message
        },
        headings: {
            en: title
        },
        included_segments: ["All"]
    });

    try {
        const response = await client.sendNotification(notification);
        console.log('Notification sent to all players:', response);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

// Function 2: Send notification to select players
async function sendNotificationToSelectPlayers(title, message, playerIds) {
    const notification = new OneSignal.Notification({
        contents: {
            en: message
        },
        headings: {
            en: title
        },
        include_player_ids: playerIds 
    });

    try {
        const response = await client.sendNotification(notification);
        console.log('Notification sent to select players:', response);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

// Exporting the functions
module.exports = {
    sendNotificationToAllPlayers,
    sendNotificationToSelectPlayers
};