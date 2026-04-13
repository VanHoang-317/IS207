const { pool } = require('./src/config/db');

const seedProducts = async () => {
    try {
        await pool.query(`
            INSERT INTO products (name, description, price, stock, category, slug, discount_price) VALUES
            ('Radiance Serum', 'Experience the ultimate care.', 29.99, 10, 'skin-care', 'radiance-serum', 24.99),
            ('Hydrating Cleanser', 'Gentle cleanser for daily use.', 18.00, 3, 'skin-care', 'hydrating-cleanser', NULL),
            ('Vitamin C Cream', 'Brighten your day and your skin.', 45.00, 0, 'skin-care', 'vitamin-c-cream', NULL),
            ('Night Time Moisturizer', 'Repair while you sleep.', 35.00, 20, 'skin-care', 'night-time-moisturizer', 30.00)
            ON CONFLICT DO NOTHING;
        `);
        console.log('Dummy products seeded successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding products:', err);
        process.exit(1);
    }
};

seedProducts();
