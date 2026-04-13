const Razorpay = require('razorpay');
const crypto = require('crypto');
const orderModel = require('../models/orderModel');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    try {
        const options = {
            amount: amount * 100, // amount in paise
            currency,
            receipt,
            notes,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err });
    }
};

const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, shippingAddress, totalAmount } = req.body;

    try {
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        // Use RAZORPAY_KEY_SECRET if available, otherwise fallback to RAZORPAY_SECRET (from plan)
        const secret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment verified
            console.log(`Payment verified for Razorpay order ${razorpay_order_id}`);

            const userId = req.user.id;
            const newOrder = await orderModel.createOrder(userId, totalAmount, shippingAddress, items, 'paid', razorpay_payment_id);

            res.json({ message: 'Payment verified successfully', order: newOrder });
        } else {
            res.status(400).json({ message: 'Invalid signature' });
        }
    } catch (err) {
        console.error('Error verifying payment:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
};
