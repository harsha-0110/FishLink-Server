const Catch = require('../models/catch');
const User = require('../models/User');

exports.addCatch = async (req, res) => {
    const { name, type, location, expectedPrice, quantity, expectedDeliveryTime } = req.body;

    try {
        const sellerId = req.user.id; // Assuming you use authentication middleware to get the user from the token

        const newCatch = new Catch({
            name,
            type,
            location,
            expectedPrice,
            quantity,
            expectedDeliveryTime,
            seller: sellerId
        });

        await newCatch.save();

        res.json({ msg: 'Catch added successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Add other operations like getting all catches, updating, deleting, etc.
