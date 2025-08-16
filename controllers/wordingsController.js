const { getConnection } = require('../config/dbConnection');


exports.getAllWordings = async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM AppWordings');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching wordings:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Updating by key
exports.updateWording = async (req, res) => {
  const key = req.params.key;
  const { value } = req.body;

  if (!value) {
    return res.status(400).json({ error: 'Value is required' });
  }

  try {
    const connection = await getConnection();
    await connection.execute(
      'UPDATE AppWordings SET Value = ?, UpdatedAt = NOW() WHERE KeyName = ?',
      [value, key]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating wording:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
