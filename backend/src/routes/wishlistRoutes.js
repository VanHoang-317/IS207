const express = require('express');
const { getWishlist, toggleWishlistItem } = require('../controllers/wishlistController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET all items in the authenticated user's wishlist
router.get('/', authMiddleware, getWishlist);

// POST toggle (add/remove) a product in the wishlist
router.post('/toggle', authMiddleware, toggleWishlistItem);

module.exports = router;
