const mysql = require('mysql2/promise');

let pool;
const getConnection = async () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQLHOST,
      port: process.env.MYSQLPORT,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      connectionLimit: 5
    });
    console.log('MySQL pool created');
  }
  return pool;
};

module.exports = { getConnection };
