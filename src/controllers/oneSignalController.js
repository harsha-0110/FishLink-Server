const OneSignal = require('onesignal-node');
require('dotenv').config();

// OneSignal Client Setup
const client = new OneSignal.Client(process.env.OSAPPID, process.env.OSAPIKEY);

// Send notification to all players
async function sendNotificationToAllPlayers(title, message, imageUrl = null) {
    const notification = {
        contents: {
            en: message
        },
        headings: {
            en: title
        },
        included_segments: ['All']
    };

    if (imageUrl) {
        notification['big_picture'] = imageUrl;
    }

    try {
        const response = await client.createNotification(notification);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

// Send notification to selected players
async function sendNotificationToSelectPlayers(title, message, playerIds, imageUrl = null) {
    const notification = {
        contents: {
            en: message
        },
        headings: {
            en: title
        },
        include_player_ids: playerIds
    };

    if (imageUrl) {
        notification['big_picture'] = imageUrl;
    }

    try {
        const response = await client.sendNotification(notification);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

module.exports = {
    sendNotificationToAllPlayers,
    sendNotificationToSelectPlayers
};