const express = require('express');
const axios = require('axios');
const router = express.Router();
const { query } = require('./db');

router.get('/health', (req, res) => {
  res.json({ service: 'payment-service', status: 'UP' });
});

router.get('/ping', (req, res) => {
  res.json({ service: 'payment-service', message: 'Payment service is reachable' });
});

router.get('/internal', async (req, res) => {
  try {
    const payments = await query('SELECT id, order_id, amount, status FROM payments LIMIT 5');
    const notificationPing = await axios.get('http://localhost:3005/ping');

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
