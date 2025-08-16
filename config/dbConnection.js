// config/dbConnection.js
const mysql = require('mysql2/promise');

function cfgFromUrl(url) {
  try {
    const u = new URL(url);
    return {
      host: u.hostname,
      port: Number(u.port || 3306),
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, ''),
    };
  } catch {
    return null;
  }
}

let pool;
const getConnection = async () => {
  if (!pool) {
    // Try discrete vars first
    let cfg =
      (process.env.MYSQLHOST && {
        host: process.env.MYSQLHOST,
        port: Number(process.env.MYSQLPORT || 3306),
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE,
      }) ||
      // Fall back to URL-style envs that Railway sometimes provides
      cfgFromUrl(process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL || process.env.DATABASE_URL) ||
      // As a last resort, assume internal host inside Railway project
      {
        host: 'mysql.railway.internal',
        port: 3306,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE,
      };

    console.log('DB CONFIG (sanitized):', {
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      database: cfg.database,
      // do NOT log password
    });

    pool = mysql.createPool({ ...cfg, connectionLimit: 5 });
    console.log('✅ MySQL pool created');
  }
  return pool;
};

module.exports = { getConnection };
