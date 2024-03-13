// ratingController.js under controllers folder
const Rating = require('../models/Rating');

exports.createRating = async (req, res) => {
    const { userId, catchId, rating, feedback } = req.body;

    try {
        const newRating = new Rating({
            userId,
            catchId,
            rating,
            feedback
        });

        await newRating.save();

        res.status(201).json({ message: 'Rating created successfully', rating: newRating });
    } catch (error) {
        console.error('Error creating rating:', error);
        res.status(500).json({ message: 'Failed to create rating' });
    }
};

exports.getRatingsByCatchId = async (req, res) => {
    const { catchId } = req.params;

    try {
        const ratings = await Rating.find({ catchId }).populate('userId', 'username');

        res.status(200).json(ratings);
    } catch (error) {
        console.error('Error fetching ratings:', error);
        res.status(500).json({ message: 'Failed to fetch ratings' });
    }
};
