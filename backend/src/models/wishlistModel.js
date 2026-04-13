const { pool } = require('../config/db');

const addToWishlist = async (userId, productId) => {
    // ON CONFLICT DO NOTHING ensures a product is only favorited once
    const query = `
    INSERT INTO wishlists (user_id, product_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, product_id) DO NOTHING
    RETURNING id, user_id, product_id, created_at;
  `;
    const result = await pool.query(query, [userId, productId]);
    return result.rows[0];
};

const removeFromWishlist = async (userId, productId) => {
    const query = `
    DELETE FROM wishlists
    WHERE user_id = $1 AND product_id = $2
    RETURNING id;
  `;
    const result = await pool.query(query, [userId, productId]);
    return result.rows[0];
};

const getUserWishlist = async (userId) => {
    // Join with products table to return the full product details
    const query = `
    SELECT w.id as wishlist_id, w.created_at as saved_at,
           p.id, p.name, p.slug, p.price, p.discount_price, p.images, p.category, p.stock
    FROM wishlists w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = $1
    ORDER BY w.created_at DESC;
  `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

const checkWishlistStatus = async (userId, productId) => {
    const query = `
    SELECT id FROM wishlists
    WHERE user_id = $1 AND product_id = $2;
  `;
    const result = await pool.query(query, [userId, productId]);
    return result.rowCount > 0;
};

module.exports = {
    addToWishlist,
    removeFromWishlist,
    getUserWishlist,
    checkWishlistStatus
};
