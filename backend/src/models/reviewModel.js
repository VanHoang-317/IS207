const { pool } = require('../config/db');

const addReview = async (productId, userId, rating, title, comment) => {
    // Inserts or updates the user's review for a given product
    const query = `
    INSERT INTO reviews (product_id, user_id, rating, title, comment)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (product_id, user_id) 
    DO UPDATE SET rating = EXCLUDED.rating, title = EXCLUDED.title, comment = EXCLUDED.comment, created_at = CURRENT_TIMESTAMP
    RETURNING id, product_id, user_id, rating, title, comment, created_at;
  `;
    const result = await pool.query(query, [productId, userId, rating, title, comment]);
    return result.rows[0];
};

const getReviewsByProduct = async (productId) => {
    const query = `
    SELECT r.id, r.product_id, r.user_id, r.rating, r.title, r.comment, r.created_at, u.name as user_name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = $1
    ORDER BY r.created_at DESC;
  `;
    const result = await pool.query(query, [productId]);
    return result.rows;
};

const getAverageRating = async (productId) => {
    const query = `
    SELECT ROUND(AVG(rating), 1) as average_rating, COUNT(id) as total_reviews
    FROM reviews
    WHERE product_id = $1;
  `;
    const result = await pool.query(query, [productId]);
    return result.rows[0];
}

module.exports = {
    addReview,
    getReviewsByProduct,
    getAverageRating
};
