// catchController.js under controllers folder
const Catch = require('../models/Catch');
const User = require('../models/User');

const fs = require('fs');
const path = require('path');

exports.addCatch = async (req, res) => {
    const { name, email, images, location, basePrice, quantity, startTime, endTime } = req.body;

    try {
        const user = await User.findOne({ email });
        
        // Array to store file paths of saved images
        let imagePaths = [];

        // Loop through each base64 encoded image
        for (let i = 0; i < images.length; i++) {
            // Decode base64 image
            const base64Data = images[i].replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');

            // Generate unique filename
            const filename = `image_${Date.now()}_${i}.png`; // You can use any desired extension

            // Specify path to save the image
            const dirPath = path.join(__dirname, '../../uploads', user.id);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            const imagePath = path.join(dirPath, filename);
            // Save the decoded image to the server
            fs.writeFileSync(imagePath, buffer);

            // Push the file path to the array
            imagePaths.push(imagePath);
        }

        // Create a new catch object with image paths
        const catchObj = new Catch({
            name,
            images: imagePaths,
            location,
            basePrice,
            quantity,
            startTime,
            endTime,
            seller: user.id,
            status: 'available'
        });

        // Save the catch object to the database
        await catchObj.save();

        // Respond with success message
        res.status(201).json({ msg: 'Catch added successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};


exports.getCatchesBySeller = async (req, res) => {
    const id = req.params.id;
    try {
        const catches = await Catch.find({ seller: id }).populate('seller', 'name email'); // Populate the seller details
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
