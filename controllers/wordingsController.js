const { getConnection } = require('../config/dbConnection');

exports.getAllWordings = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM AppWordings');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching wordings:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateWording = async (req, res) => {
  const key = req.params.key;
  const { value } = req.body;

  if (!value) {
    return res.status(400).json({ error: 'Value is required' });
  }

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('KeyName', key)
      .input('Value', value)
      .query('UPDATE AppWordings SET Value = @Value, UpdatedAt = GETDATE() WHERE KeyName = @KeyName');

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating wording:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
