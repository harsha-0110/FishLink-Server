const Rating = require('../models/Rating');
const Catch = require('../models/Catch');
const Bid = require('../models/Bid');
const User = require('../models/User');


exports.createRating = async (req, res) => {
    const { ratedUserId, rating, comment, commenterUsername, catchId } = req.body; // Include catchId
    try {
        const newRating = new Rating({
            ratedUserId,
            rating,
            comment,
            commenterUsername,
            catchId
        });

        await newRating.save();

        // Update buyerRated status
        const catchObj = await Catch.findByIdAndUpdate(catchId, { buyerRated: true });
        if (!catchObj) {
            return res.status(404).json({ msg: 'Catch not found' });
        }
        

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

exports.getBuyerRatings = async (req, res) => {
    try {
        const { buyerId, catchId } = req.params;
        const query = { ratedUserId: buyerId };
        if (catchId) {
            query.catchId = catchId;
        }
        const buyerRatings = await Rating.find(query);
        res.status(200).json(buyerRatings);
    } catch (error) {
        console.error('Error fetching seller ratings:', error);
        if (error.name === 'CastError') {
            res.status(400).json({ error: 'Invalid seller or catch ID' });
        } else {
            res.status(500).json({ error: 'Failed to fetch seller ratings' });
        }
    }
};
