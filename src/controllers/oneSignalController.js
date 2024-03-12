const OneSignal = require('onesignal-node');
require('dotenv').config();

// OneSignal Client Setup
const client = new OneSignal.Client(process.env.OSAPPID, process.env.OSAPIKEY,);

// Function 1: Send notification to all players
async function sendNotificationToAllPlayers(title, message) {
    const notification = {
        contents: {
            en: message
        },
        headings: {
            en: title
        },
        included_segments: ['All']
    };

    try {
        const response = await client.createNotification(notification);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

// Function 2: Send notification to select players
async function sendNotificationToSelectPlayers(title, message, playerIds) {
    const notification = {
        contents: {
            en: message
        },
        headings: {
            en: title
        },
        include_player_ids: playerIds
    };
    
    try {
        const response = await client.sendNotification(notification);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

// Exporting the functions
module.exports = {
    sendNotificationToAllPlayers,
    sendNotificationToSelectPlayers
};