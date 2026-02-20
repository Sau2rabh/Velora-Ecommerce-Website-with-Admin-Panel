const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/supportController');

router.post('/contact', submitContactForm);

module.exports = router;
