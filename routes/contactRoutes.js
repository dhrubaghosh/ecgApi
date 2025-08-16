const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// GET list of contacts (for testing in browser)
router.get('/', contactController.getContacts);

// POST submit contact form
router.post('/', contactController.submitContactForm);

module.exports = router;
