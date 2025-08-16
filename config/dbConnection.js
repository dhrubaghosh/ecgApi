// dbConnection.js
const mysql = require('mysql2/promise');

let pool;

async function getConnection() {
  if (!pool) {
    // Prefer MYSQL_URL (internal) when available (inside Railway)
    // Fallback to MYSQL_PUBLIC_URL (for local dev)
    const url = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;

    pool = mysql.createPool(url);

    // Log sanitized info (without password)
    const u = new URL(url);
    console.log('DB CONFIG:', {
      host: u.hostname,
      port: u.port,
      user: u.username,
      database: u.pathname.replace('/', ''),
    });
  }
  return pool;
}

module.exports = { getConnection };
