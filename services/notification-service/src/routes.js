const express = require('express');
const router = express.Router();
const { query } = require('./db');

router.get('/health', (req, res) => {
  res.json({ service: 'notification-service', status: 'UP' });
});

router.get('/ping', (req, res) => {
  res.json({ service: 'notification-service', message: 'Notification service is reachable' });
});

router.get('/internal', async (req, res) => {
  try {
    const notifications = await query('SELECT id, message, status FROM notifications LIMIT 5');
    res.json({ service: 'notification-service', notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
