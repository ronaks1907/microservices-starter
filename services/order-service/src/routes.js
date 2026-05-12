const express = require('express');
const axios = require('axios');
const router = express.Router();
const { query } = require('./db');

// Detect if running in Docker
const inDocker = process.env.DOCKER_ENV === 'true' || !process.env.MYSQL_HOST?.includes('localhost');
const serviceHost = (port) => {
  if (inDocker) {
    if (port === 3001) return 'http://user-service:3001';
    if (port === 3002) return 'http://product-service:3002';
    if (port === 3004) return 'http://payment-service:3004';
    if (port === 3005) return 'http://notification-service:3005';
  }
  return `http://localhost:${port}`;
};

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
      axios.get(`${serviceHost(3002)}/ping`),
      axios.get(`${serviceHost(3004)}/ping`)
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
