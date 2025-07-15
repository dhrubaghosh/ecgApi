require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const paymentRoutes = require('./routes/paymentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const wordingsRoutes = require('./routes/wordingsRoutes');
const imagesRoutes = require('./routes/imagesRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/payments', paymentRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/wordings', wordingsRoutes);
app.use('/api/images', imagesRoutes);


app.get('/test', (req, res) => {
  res.send('Server is running!');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
