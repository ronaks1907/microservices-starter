const express = require('express');
const axios = require('axios');
const router = express.Router();
const { query } = require('./db');

router.get('/health', (req, res) => {
  res.json({ service: 'order-service', status: 'UP' });
});

router.get('/ping', (req, res) => {
  res.json({ service: 'order-service', message: 'Order service is reachable' });
});

router.get('/internal', async (req, res) => {
  try {
    const orders = await query('SELECT id, product_id, amount, total, status FROM orders LIMIT 5');
    const [productPing, paymentPing] = await Promise.all([
      axios.get('http://localhost:3002/ping'),
      axios.get('http://localhost:3004/ping')
    ]);

    res.json({
      service: 'order-service',
      orders,
      downstream: {
        productService: productPing.data,
        paymentService: paymentPing.data
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
