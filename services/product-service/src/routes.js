const express = require('express');
const router = express.Router();
const { query } = require('./db');

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
