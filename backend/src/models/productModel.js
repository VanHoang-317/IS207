const { pool } = require('../config/db');

const parseImages = (product) => {
    if (!product) return product;
    
    // Nếu Postgres trả về string (do lưu kiểu TEXT hoặc JSON đơn thuần)
    if (typeof product.images === 'string') {
        try {
            // Kiểm tra nếu là chuỗi JSON mảng: ["link1", "link2"]
            if (product.images.startsWith('[') || product.images.startsWith('{')) {
                product.images = JSON.parse(product.images);
            } else {
                // Nếu chỉ là một link đơn lẻ không phải JSON
                product.images = [product.images];
            }
        } catch (e) {
            product.images = [];
        }
    }
    
    // Đảm bảo images luôn là mảng để Frontend không bị crash
    if (!Array.isArray(product.images)) {
        product.images = product.images ? [product.images] : [];
    }
    
    return product;
};

const getAllProducts = async ({ limit = 12, offset = 0, search, category, minPrice, maxPrice, sort, tag }) => {
    let whereClauses = [];
    let values = [];
    let queryIndex = 1;

    if (category) {
        whereClauses.push(`LOWER(category) = LOWER($${queryIndex++})`);
        values.push(category);
    }

     if (tag) {  
        whereClauses.push(`tag = $${queryIndex++}`);
        values.push(tag); 
    }

    if (minPrice) {
        whereClauses.push(`price >= $${queryIndex++}`);
        values.push(minPrice);
    }
    if (maxPrice) {
        whereClauses.push(`price <= $${queryIndex++}`);
        values.push(maxPrice);
    }
    if (search) {
        whereClauses.push(`(name ILIKE $${queryIndex} OR description ILIKE $${queryIndex})`);
        values.push(`%${search}%`);
        queryIndex++;
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    let orderString = 'ORDER BY created_at DESC';
    if (sort === 'price_asc') orderString = 'ORDER BY price ASC';
    if (sort === 'price_desc') orderString = 'ORDER BY price DESC';
    if (sort === 'newest') orderString = 'ORDER BY created_at DESC';

    const countQuery = `SELECT COUNT(*) FROM products ${whereString}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count, 10);

    const mainQuery = `
        SELECT * FROM products 
        ${whereString} 
        ${orderString} 
        LIMIT $${queryIndex++} OFFSET $${queryIndex++}
    `;

    const result = await pool.query(mainQuery, [...values, limit, offset]);

    return {
        products: result.rows.map(parseImages),
        total,
        limit,
        offset
    };
};

const getProductBySlug = async (slug) => {
    const result = await pool.query('SELECT * FROM products WHERE slug = $1', [slug]);
    return parseImages(result.rows[0]);
};

// ✅ Thêm hàm này
const getProductById = async (id) => {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return parseImages(result.rows[0]);
};

const createProduct = async (product) => {
    const { name, slug, description, price, discount_price, stock, images, category, ingredients, tag } = product;
    
    // Đảm bảo images gửi vào Database là mảng chuẩn của Postgres
    const imageArray = Array.isArray(images) ? images : (typeof images === 'string' ? JSON.parse(images) : []);

    const query = `
        INSERT INTO products (name, slug, description, price, discount_price, stock, images, category, ingredients, tag)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
    `;
    const values = [name, slug, description, price, discount_price, stock, imageArray, category, ingredients, tag || null];
    const result = await pool.query(query, values);
    return parseImages(result.rows[0]);
};

const updateProduct = async (id, product) => {
    const { name, slug, description, price, discount_price, stock, images, category, ingredients, tag } = product;
    
    // Xử lý để Postgres nhận diện đúng kiểu dữ liệu mảng
    let imageArray = images;
    if (typeof images === 'string') {
        try { imageArray = JSON.parse(images); } 
        catch (e) { imageArray = [images]; }
    }

    const query = `
        UPDATE products
        SET name=$1, slug=$2, description=$3, price=$4, discount_price=$5, stock=$6, images=$7, category=$8, ingredients=$9, tag=$10
        WHERE id=$11
        RETURNING *;
    `;
    const values = [name, slug, description, price, discount_price, stock, imageArray, category, ingredients, tag || null, id];
    const result = await pool.query(query, values);
    return parseImages(result.rows[0]);
};

const deleteProduct = async (id) => {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
};

module.exports = {
    getAllProducts,
    getProductBySlug,
    getProductById,  // ✅ đã có hàm
    createProduct,
    updateProduct,
    deleteProduct,
};