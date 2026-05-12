require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./logger');
const routes = require('./routes');
const { initDb } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(routes);

const port = process.env.SERVICE_PORT || 3004;

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`payment-service listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize the database:', err);
    process.exit(1);
  });
