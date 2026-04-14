const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 1. Security HTTP headers
app.use(helmet());

// 2. Rate Limiting (approx 100 requests per 15 minutes per IP)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests from this IP, please try again after an hour' },
});
app.use('/api', limiter);

// 3. CORS rules
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.get('/', (req, res) => {
    res.send('API is running securely...');
});

// 4. Centralized Error Handling Middleware
// Must be registered LAST, after all routes and standard middleware
app.use(errorMiddleware);

module.exports = app;
