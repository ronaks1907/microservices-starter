const express = require('express');
const router = express.Router();
const { query } = require('./db');

// Detect if running in Docker
const inDocker = process.env.DOCKER_ENV === 'true' || !process.env.MYSQL_HOST?.includes('localhost');
const serviceHost = (port) => {
  if (inDocker) {
    if (port === 3001) return 'http://user-service:3001';
    if (port === 3003) return 'http://order-service:3003';
    if (port === 3004) return 'http://payment-service:3004';
    if (port === 3005) return 'http://notification-service:3005';
  }
  return `http://localhost:${port}`;
};

router.get('/health', (req, res) => {
  res.json({ service: 'product-service', status: 'UP' });
});

router.get('/ping', (req, res) => {
  res.json({ service: 'product-service', message: 'Product service is reachable' });
});

router.get('/internal', async (req, res) => {
  try {
    const products = await query('SELECT id, name, price, available FROM products LIMIT 5');
    res.json({ service: 'product-service', products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
