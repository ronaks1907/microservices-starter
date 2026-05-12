const mysql = require('mysql2/promise');
const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

const pool = mysql.createPool({
  host: MYSQL_HOST || 'localhost',
  port: Number(MYSQL_PORT || 3306),
  user: MYSQL_USER || 'root',
  password: MYSQL_PASSWORD || 'rootpass',
  database: MYSQL_DATABASE || 'microservices',
  waitForConnections: true,
  connectionLimit: 10
});

async function waitForDb(retries = 12, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const connection = await mysql.createConnection({
        host: MYSQL_HOST || 'localhost',
        port: Number(MYSQL_PORT || 3306),
        user: MYSQL_USER || 'root',
        password: MYSQL_PASSWORD || 'rootpass'
      });
      await connection.query('SELECT 1');
      await connection.end();
      return;
    } catch (err) {
      if (attempt === retries) {
        throw err;
      }
      console.warn(`Database unavailable, retrying (${attempt}/${retries})...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function initDb() {
  await waitForDb();

  const createTableSql = `CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(80) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB`;

  await pool.query(createTableSql);
  await pool.query(`INSERT IGNORE INTO payments (id, order_id, amount, status) VALUES
    (1, 1, 49.98, 'COMPLETED'),
    (2, 2, 39.99, 'PENDING')
  `);
}

async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

module.exports = { initDb, query };
