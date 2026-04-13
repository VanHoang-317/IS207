const wishlistModel = require('../models/wishlistModel');

// GET /api/wishlist
const getWishlist = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const wishlist = await wishlistModel.getUserWishlist(userId);
        res.json(wishlist);
    } catch (err) {
        console.error('Error fetching wishlist:', err);
        next(err);
    }
};

// POST /api/wishlist/toggle
const toggleWishlistItem = async (req, res, next) => {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    try {
        const isSaved = await wishlistModel.checkWishlistStatus(userId, productId);

        if (isSaved) {
            // Remove from wishlist
            await wishlistModel.removeFromWishlist(userId, productId);
            return res.json({ message: 'Removed from wishlist', isSaved: false });
        } else {
            // Add to wishlist
            await wishlistModel.addToWishlist(userId, productId);
            return res.json({ message: 'Added to wishlist', isSaved: true });
        }
    } catch (err) {
        console.error('Error toggling wishlist item:', err);
        next(err);
    }
};

module.exports = {
    getWishlist,
    toggleWishlistItem
};
