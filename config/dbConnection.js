// config/dbConnection.js
const mysql = require('mysql2/promise');

let pool;
const getConnection = async () => {
  if (!pool) {
    // Use Railway's public proxy host/port – works everywhere
    const config = {
      host: 'metro.proxy.rlwy.net',
      port: 36227,
      user: 'root',
      password: 'lAngSqcgBcnpRgtAZsCjkXJNdhuEXDag',
      database: 'railway',
      connectTimeout: 10000,
    };

    console.log('DB CONFIG (public proxy):', {
      host: config.host,
      port: config.port,
      user: config.user,
      database: config.database,
    });

    pool = mysql.createPool({ ...config, connectionLimit: 5 });
    console.log('✅ MySQL pool created');
  }
  return pool;
};

module.exports = { getConnection };
