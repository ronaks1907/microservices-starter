const express = require('express');
const router = express.Router();
const axios = require('axios');
const { query } = require('./db');

// Detect if running in Docker
const inDocker = process.env.DOCKER_ENV === 'true' || !process.env.MYSQL_HOST?.includes('localhost');
const serviceHost = (port) => {
  if (inDocker) {
    if (port === 3002) return 'http://product-service:3002';
    if (port === 3003) return 'http://order-service:3003';
    if (port === 3004) return 'http://payment-service:3004';
    if (port === 3005) return 'http://notification-service:3005';
  }
  return `http://localhost:${port}`;
};

router.get('/health', (req, res) => {
  res.json({ service: 'user-service', status: 'UP' });
});

router.get('/ping', (req, res) => {
  res.json({ service: 'user-service', message: 'User service is reachable' });
});

router.get('/internal', async (req, res) => {
  try {
    const users = await query('SELECT id, name, email FROM users LIMIT 5');
    const productPing = await axios.get(`${serviceHost(3002)}/ping`);

    res.json({
      service: 'user-service',
      internal: {
        users,
        productServicePing: productPing.data
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
