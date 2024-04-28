const Rating = require('../models/Rating');
const Catch = require('../models/Catch');
const Bid = require('../models/Bid');
const User = require('../models/User');


exports.createRating = async (req, res) => {
    const { ratedUserId, rating, comment, commenterUsername } = req.body; // Update property names
    try {
        const newRating = new Rating({
            ratedUserId, // Update property name
            rating,
            comment,
            commenterUsername // Update property name
        });

        await newRating.save();

        res.status(201).json({ message: 'Rating created successfully', rating: newRating });
    } catch (error) {
        console.error('Error creating rating:', error);
        res.status(500).json({ message: 'Failed to create rating' });
    }
};

exports.getRatingsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const ratings = await Rating.find({ ratedUserId: userId }).populate('ratedUserId', 'username');

        res.status(200).json(ratings);
    } catch (error) {
        console.error('Error fetching ratings:', error);
        res.status(500).json({ message: 'Failed to fetch ratings' });
    }
};
