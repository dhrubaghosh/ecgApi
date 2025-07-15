const express = require('express');
const router = express.Router();
const wordingsController = require('../controllers/wordingsController');

router.get('/', wordingsController.getAllWordings);
router.post('/:key', wordingsController.updateWording);

module.exports = router;
