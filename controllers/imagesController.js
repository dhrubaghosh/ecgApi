const path = require('path');
const fs = require('fs');
const { getConnection } = require('../config/dbConnection');

exports.getAllImages = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM AppImages');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateImageTitle = async (req, res) => {
  const id = req.params.id;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('Id', id)
      .input('Title', title)
      .query('UPDATE AppImages SET Title = @Title WHERE Id = @Id');

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating title:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.replaceImage = async (req, res) => {
  const id = req.params.id;
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const relativePath = '/uploads/' + req.file.filename;

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('Id', id)
      .input('ImageUrl', relativePath)
      .query('UPDATE AppImages SET ImageUrl = @ImageUrl WHERE Id = @Id');

    res.json({ success: true, imageUrl: relativePath });
  } catch (err) {
    console.error('Error updating image:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
