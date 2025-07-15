const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const getConnection = async () => {
  try {
    const pool = await sql.connect(config);
    console.log('SQL Server connected!');
    return pool;
  } catch (err) {
    console.error('SQL Server connection error:', err);
    throw err;
  }
};

module.exports = { getConnection };
