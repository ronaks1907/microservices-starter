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
    if (port === 3003) return 'http://order-service:3003';
    if (port === 3005) return 'http://notification-service:3005';
  }
  return `http://localhost:${port}`;
};

router.get('/health', (req, res) => {
  res.json({ service: 'payment-service', status: 'UP' });
});

router.get('/ping', (req, res) => {
  res.json({ service: 'payment-service', message: 'Payment service is reachable' });
});

router.get('/internal', async (req, res) => {
  try {
    const payments = await query('SELECT id, order_id, amount, status FROM payments LIMIT 5');
    const notificationPing = await axios.get(`${serviceHost(3005)}/ping`);

    res.json({
      service: 'payment-service',
      payments,
      downstream: {
        notificationService: notificationPing.data
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
