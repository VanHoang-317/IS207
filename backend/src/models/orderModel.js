const { pool } = require('../config/db');

const createOrder = async (userId, totalAmount, shippingAddress, items, status = 'pending', paymentId = null) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const orderQuery = `
      INSERT INTO orders (user_id, total_amount, shipping_address, status, payment_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, created_at, status;
    `;
        const orderResult = await client.query(orderQuery, [userId, totalAmount, shippingAddress, status, paymentId]);
        const order = orderResult.rows[0];

        const itemQuery = `
      INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
      VALUES ($1, $2, $3, $4, $5)
    `;

        for (const item of items) {
            await client.query(itemQuery, [order.id, item.product_id, item.product_name || null, item.quantity, item.price]);
        }

        await client.query('COMMIT');
        return order;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const getOrderById = async (id) => {
    const query = `
    SELECT 
      o.*, 
      json_agg(oi.*) AS items,
      u.name AS user_name,
      u.email AS user_email
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN users u ON o.user_id = u.id
    WHERE o.id = $1
    GROUP BY o.id, u.name, u.email;
  `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
};

const getOrdersByUser = async (userId) => {
    const query = `
    SELECT o.*, json_agg(oi.*) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC;
  `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

const getAllOrders = async () => {
    const query = `
    SELECT o.*, json_agg(oi.*) as items, u.name as user_name
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN users u ON o.user_id = u.id
    GROUP BY o.id, u.name
    ORDER BY o.created_at DESC;
  `;
    const result = await pool.query(query);
    return result.rows;
};

const updateOrderStatus = async (id, status, paymentId = null, trackingId = null) => {
    let query = 'UPDATE orders SET status = $1';
    let values = [status];
    let idx = 2;

    if (paymentId) {
        query += `, payment_id = $${idx++}`;
        values.push(paymentId);
    }
    if (trackingId) {
        query += `, tracking_id = $${idx++}`;
        values.push(trackingId);
    }

    query += ` WHERE id = $${idx} RETURNING *`;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0];
};

module.exports = {
    createOrder,
    getOrderById,
    getOrdersByUser,
    getAllOrders,
    updateOrderStatus,
};
