require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');
const wordingsRoutes = require('./routes/wordingsRoutes');
const { getConnection } = require('./config/dbConnection');

const app = express();
const allowedOrigins = [
  'http://localhost:5173',        
  process.env.FRONTEND_ORIGIN     
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/contacts', contactRoutes);
app.use('/api/wordings', wordingsRoutes);
app.get('/test', (req, res) => {
  res.send('Server is running!');
});
app.get('/db-test', async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query('SELECT NOW() AS currentTime');
    res.json({ connected: true, currentTime: rows[0].currentTime });
  } catch (err) {
    console.error('DB test error:', err);
    res.status(500).json({ connected: false, error: err.message });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
