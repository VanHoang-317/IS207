const reviewModel = require('../models/reviewModel');

// POST /api/reviews/:productId
const createReview = async (req, res, next) => {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    try {
        const review = await reviewModel.addReview(productId, userId, rating, title, comment);
        res.status(201).json({ message: 'Review successfully submitted', review });
    } catch (err) {
        console.error('Error creating review:', err);
        next(err);
    }
};

// GET /api/reviews/:productId
const getProductReviews = async (req, res, next) => {
    const { productId } = req.params;

    try {
        const reviews = await reviewModel.getReviewsByProduct(productId);
        const stats = await reviewModel.getAverageRating(productId);

        res.json({
            averageRating: parseFloat(stats.average_rating) || 0,
            totalReviews: parseInt(stats.total_reviews) || 0,
            reviews
        });
    } catch (err) {
        console.error('Error fetching product reviews:', err);
        next(err);
    }
};

module.exports = {
    createReview,
    getProductReviews
};
