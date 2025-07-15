const { getConnection } = require('../config/dbConnection');

exports.submitContactForm = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    // console.log("Received body-----------------", req.body);

    if (!name || !phone || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const pool = await getConnection();
    await pool.request()
      .input('name', name)
      .input('phone', phone)
      .input('email', email)
      .input('message', message)
      .query(`
        INSERT INTO ContactUs (Name, Phone, Email, Message, ContactedAt)
        VALUES (@name, @phone, @email, @message, GETDATE() )
      `);

    return res.status(200).json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error saving contact form:', error.message, error.stack);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
