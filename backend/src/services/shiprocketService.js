const axios = require('axios');

let token = null;

const login = async () => {
    try {
        const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
            email: process.env.SHIPROCKET_EMAIL,
            password: process.env.SHIPROCKET_PASSWORD,
        });
        token = response.data.token;
        return token;
    } catch (err) {
        console.error('Shiprocket login error:', err.response?.data || err.message);
        throw err;
    }
};

const createShipment = async (order) => {
    if (!token) await login();

    const address = order.shipping_address || {};
    const items = Array.isArray(order.items) ? order.items : [];

    const shipmentData = {
        order_id: order.id,
        order_date: order.created_at || new Date().toISOString(),
        pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
        billing_customer_name: (order.user && order.user.name) || order.user_name || 'Customer',
        billing_last_name: '',
        billing_address: address.street,
        billing_city: address.city,
        billing_pincode: address.zip,
        billing_state: address.state,
        billing_country: address.country || 'India',
        billing_email: (order.user && order.user.email) || order.user_email || 'customer@example.com',
        billing_phone: process.env.SHIPROCKET_DEFAULT_PHONE || '9999999999',
        shipping_is_billing: true,
        order_items: items.length
            ? items.map((item) => ({
                  name: item.product_name || 'Item',
                  sku: item.product_id || item.product_name || 'SKU',
                  units: item.quantity || 1,
                  selling_price: Number(item.price) || Number(order.total_amount) || 0,
              }))
            : [
                  {
                      name: 'Item',
                      sku: 'SKU',
                      units: 1,
                      selling_price: Number(order.total_amount) || 0,
                  },
              ],
        payment_method: order.status === 'paid' ? 'Prepaid' : 'COD',
        sub_total: Number(order.total_amount) || 0,
        length: 10,
        breadth: 10,
        height: 10,
        weight: 0.5,
    };

    try {
        const response = await axios.post(
            'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
            shipmentData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (err) {
        if (err.response?.status === 401) {
            await login();
            return createShipment(order); // Retry once
        }
        console.error('Shiprocket create shipment error:', err.response?.data || err.message);
        throw err;
    }
};

module.exports = {
    login,
    createShipment,
};
