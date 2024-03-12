const User = require('../models/User');

exports.loginUser = async (req, res) => {
    const { userId, deviceId } = req.body;

    try {
        // Find the user by userId
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the device ID for the user
        user.deviceId = deviceId;
        await user.save();

        res.status(200).json({ message: 'Device ID updated successfully' });
    } catch (error) {
        console.error('Error updating device ID:', error);
        res.status(500).json({ message: 'Failed to update device ID' });
    }
};

exports.logoutUser = async (req, res) => {
    const { userId } = req.body;

    try {
        // Find the user by userId
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Clear the device ID for the user
        user.deviceId = null;
        await user.save();

        res.status(200).json({ message: 'Device ID cleared successfully' });
    } catch (error) {
        console.error('Error clearing device ID:', error);
        res.status(500).json({ message: 'Failed to clear device ID' });
    }
};
