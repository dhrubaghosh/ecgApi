// config/dbConnection.js
const mysql = require('mysql2/promise');

let pool;

const getConnection = async () => {
  if (!pool) {
    // 👇 Toggle between local & Railway manually here
    const useLocal = false; // change to true when testing locally

    const config = useLocal
      ? {
          host: 'metro.proxy.rlwy.net',
          port: 36227,
          user: 'root',
          password: 'lAngSqcgBcnpRgtAZsCjkXJNdhuEXDag',
          database: 'railway',
        }
      : {
          host: 'mysql.railway.internal',
          port: 3306,
          user: 'root',
          password: 'lAngSqcgBcnpRgtAZsCjkXJNdhuEXDag',
          database: 'railway',
        };

    console.log('✅ Using DB config:', config);

    pool = mysql.createPool({
      ...config,
      connectionLimit: 5,
    });
  }

  return pool;
};

module.exports = { getConnection };
