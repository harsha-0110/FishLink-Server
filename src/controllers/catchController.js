// catchController.js under controllers folder
const Catch = require('../models/Catch');
const User = require('../models/User');
const notify = require('./oneSignalController');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

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
            imagePaths.push(`/uploads/${user.id}/${filename}`);
        }

        // Create a new catch object with image paths
        const catchObj = new Catch({
            name,
            images: imagePaths,
            location,
            basePrice,
            currentBid: basePrice,
            quantity,
            startTime,
            endTime,
            seller: user.id,
            status: 'available'
        });

        // Save the catch object to the database
        await catchObj.save();
        const imgUrl = `${process.env.SURL}${imagePaths[0]}`;
        notify.sendNotificationToAllPlayers("New Catch Added", name, imgUrl);
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

        const catches = await Catch.find({ status: "available" }).populate('seller', 'name email');

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

        // Check if there's a highestBidder field
        if (catchObj.highestBidder) {
            const user = await User.findById(catchObj.highestBidder);
            if (user) {
                // Replace highestBidder with the username
                catchObj.highestBidder = user.username;
            }
        }

        res.json(catchObj);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.editCatch = async (req, res) => {
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

        // Retrieve the array of image locations
        const imageLocations = catchObj.images;

        // Iterate over each image location and delete the corresponding image file
        imageLocations.forEach(imageLocation => {
            const dirPath = path.join(__dirname, '../../', imageLocation);
            // Check if the image file exists before attempting to delete it
            if (fs.existsSync(dirPath)) {
                fs.unlinkSync(dirPath);
            }
        });

        await Catch.findByIdAndDelete(catchId);

        res.json({ msg: 'Catch deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
