const { getConnection } = require('../config/dbConnection');

exports.submitContactForm = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    if (!name || !phone || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const db = await getConnection();
    await db.execute(
      `INSERT INTO ContactUs (Name, Phone, Email, Message, ContactedAt)
       VALUES (?, ?, ?, ?, NOW())`,
      [name, phone, email, message]
    );
    return res.status(200).json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error saving contact form:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// NEW: GET /api/contacts
exports.getContacts = async (_req, res) => {
  try {
    const db = await getConnection();
    const [rows] = await db.query(
      'SELECT Id, Name, Phone, Email, Message, ContactedAt FROM ContactUs ORDER BY Id DESC LIMIT 50'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
