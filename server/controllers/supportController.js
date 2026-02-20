const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');

// @desc    Submit contact form
// @route   POST /api/support/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please provide all fields');
  }

  // In a real production environment, you would configure nodemailer here
  // For now, we simulate the email sending by logging to console
  console.log(`---------------------------------------------------`);
  console.log(`[CONTACT FORM] New Message Received`);
  console.log(`From: ${name} (${email})`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  console.log(`---------------------------------------------------`);

  // Mock successful response
  res.status(200).json({
    message: 'Your message has been received. We will get back to you soon!',
  });
});

module.exports = {
  submitContactForm,
};
