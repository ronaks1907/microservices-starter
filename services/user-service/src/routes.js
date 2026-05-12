const express = require('express');
const router = express.Router();
const axios = require('axios');
const { query } = require('./db');

router.get('/health', (req, res) => {
  res.json({ service: 'user-service', status: 'UP' });
});

router.get('/ping', (req, res) => {
  res.json({ service: 'user-service', message: 'User service is reachable' });
});

router.get('/internal', async (req, res) => {
  try {
    const users = await query('SELECT id, name, email FROM users LIMIT 5');
    const productPing = await axios.get('http://localhost:3002/ping');

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
