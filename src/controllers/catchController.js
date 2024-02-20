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
            seller: req.user.id, // Assuming you have middleware to extract the user from the token
            status: 'available'
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

exports.getAllCatches = async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};

        const catches = await Catch.find(query).populate('seller', 'name email');

        res.json(catches);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};


exports.getCatchById = async (req, res) => {
    const catchId = req.params.id;

    try {
        const catchObj = await Catch.findById(catchId).populate('seller', 'name email'); // Populate the seller details

        if (!catchObj) {
            return res.status(404).json({ msg: 'Catch not found' });
        }

        res.json(catchObj);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updateCatch = async (req, res) => {
    const catchId = req.params.id;
    const { name, images, location, basePrice, quantity, startTime, endTime } = req.body;

    try {
        let catchObj = await Catch.findById(catchId);

        if (!catchObj) {
            return res.status(404).json({ msg: 'Catch not found' });
        }

        // Update catch details
        catchObj.name = name;
        catchObj.images = images;
        catchObj.location = location;
        catchObj.basePrice = basePrice;
        catchObj.quantity = quantity;
        catchObj.startTime = startTime;
        catchObj.endTime = endTime;

        await catchObj.save();

        res.json({ msg: 'Catch updated successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.deleteCatch = async (req, res) => {
    const catchId = req.params.id;

    try {
        const catchObj = await Catch.findById(catchId);

        if (!catchObj) {
            return res.status(404).json({ msg: 'Catch not found' });
        }

        await catchObj.remove();

        res.json({ msg: 'Catch deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Other methods...
