const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const imagesController = require('../controllers/imagesController');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.get('/', imagesController.getAllImages);
router.post('/:id/title', imagesController.updateImageTitle);
router.post('/:id', upload.single('image'), imagesController.replaceImage);

module.exports = router;
