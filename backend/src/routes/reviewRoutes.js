const express = require('express');
const { createReview, getProductReviews } = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET all reviews for a specific product (Public)
router.get('/:productId', getProductReviews);

// POST a new review for a product (Requires Auth)
router.post('/:productId', authMiddleware, createReview);

module.exports = router;
