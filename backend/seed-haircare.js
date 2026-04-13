const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const hairCareProducts = [
    {
        name: "Argan Oil Shampoo",
        slug: "argan-oil-shampoo",
        description: "Luxurious sulfate-free shampoo infused with pure Moroccan argan oil. Gently cleanses while deeply nourishing each strand, leaving hair silky smooth and brilliantly shiny. Perfect for dry, damaged, or color-treated hair.",
        price: 22.00,
        discount_price: null,
        stock: 30,
        images: '{"https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600"}',
        category: "hair-care",
        ingredients: "Argan Oil, Coconut Oil, Vitamin E, Aloe Vera, Keratin"
    },
    {
        name: "Keratin Hair Mask",
        slug: "keratin-hair-mask",
        description: "Intensive deep conditioning treatment packed with keratin proteins and natural oils. Repairs damage from heat styling and chemical treatments. Use weekly for salon-quality results at home.",
        price: 34.99,
        discount_price: 28.99,
        stock: 20,
        images: '{"https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600"}',
        category: "hair-care",
        ingredients: "Keratin Protein, Shea Butter, Jojoba Oil, Biotin, Silk Amino Acids"
    },
    {
        name: "Rosemary Growth Serum",
        slug: "rosemary-growth-serum",
        description: "Clinically-inspired scalp serum with rosemary extract and biotin to promote thicker, fuller hair. Lightweight and non-greasy formula absorbs quickly to stimulate follicles and reduce hair thinning.",
        price: 29.99,
        discount_price: null,
        stock: 15,
        images: '{"https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600"}',
        category: "hair-care",
        ingredients: "Rosemary Extract, Biotin, Castor Oil, Peppermint, Caffeine"
    },
    {
        name: "Silk Protein Conditioner",
        slug: "silk-protein-conditioner",
        description: "Weightless daily conditioner enriched with hydrolyzed silk proteins. Detangles effortlessly, adds mirror-like shine, and protects against environmental damage. Suitable for all hair types.",
        price: 19.99,
        discount_price: 16.99,
        stock: 40,
        images: '{"https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600"}',
        category: "hair-care",
        ingredients: "Silk Proteins, Avocado Oil, Panthenol, Green Tea Extract, Honey"
    }
];

async function seedHairCare() {
    const client = await pool.connect();
    try {
        for (const p of hairCareProducts) {
            // Check if product already exists
            const existing = await client.query('SELECT id FROM products WHERE slug = $1', [p.slug]);
            if (existing.rows.length > 0) {
                console.log(`Skipping "${p.name}" - already exists`);
                continue;
            }

            await client.query(
                `INSERT INTO products (name, slug, description, price, discount_price, stock, images, category, ingredients)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [p.name, p.slug, p.description, p.price, p.discount_price, p.stock, p.images, p.category, p.ingredients]
            );
            console.log(`Added: ${p.name}`);
        }
        console.log("Hair Care products seeded successfully!");
    } catch (err) {
        console.error("Error seeding products:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

seedHairCare();
