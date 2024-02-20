// catchController.js under controllers folder
const Catch = require('../models/Catch');

exports.addCatch = async (req, res) => {
    const { name, images, location, basePrice, quantity, startTime, endTime } = req.body;

    try {
        const catchObj = new Catch({
            name,
            images,
            location,
            basePrice,
            quantity,
            startTime,
            endTime,
            seller: req.user.id // Assuming you have middleware to extract the user from the token
        });

        await catchObj.save();

        res.status(201).json({ msg: 'Catch added successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getCatchesBySeller = async (req, res) => {
    try {
        const catches = await Catch.find({ seller: req.user.id }).populate('seller', 'name email'); // Populate the seller details

        res.json(catches);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Other existing methods...
