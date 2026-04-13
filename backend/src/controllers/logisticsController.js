const shiprocketService = require('../services/shiprocketService');
const orderModel = require('../models/orderModel');

const createShipment = async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ message: 'orderId is required' });
    }

    try {
        const order = await orderModel.getOrderById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Optional: only allow shipping for paid or pending (COD) orders
        if (!['paid', 'pending'].includes(order.status)) {
            return res.status(400).json({ message: `Cannot create shipment for order with status "${order.status}"` });
        }

        const enrichedOrder = {
            id: order.id,
            total_amount: Number(order.total_amount),
            shipping_address: order.shipping_address,
            items: order.items || [],
            user: {
                name: order.user_name || 'Customer',
                email: order.user_email || 'customer@example.com',
            },
        };

        const shipment = await shiprocketService.createShipment(enrichedOrder);

        await orderModel.updateOrderStatus(orderId, 'shipped', null, shipment.awb_code || null);

        res.json({ message: 'Shipment created', shipment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Logistics error', error: err.message });
    }
};

module.exports = {
    createShipment,
};
