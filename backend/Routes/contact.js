const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

// Transporter setup using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Nodemailer transporter verification failed:', error);
  } else {
    console.log('✅ Nodemailer transporter verified and ready to send emails');
  }
});

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
    subject: subject || `New message from ${name}`,
    html: `
      <h2>📩 New Contact Message</h2>
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      <p><strong>Subject:</strong> ${subject || 'No subject provided'}</p>
      <p><strong>Message:</strong></p>
      <div style="white-space: pre-line; border-left: 2px solid #ccc; padding-left: 10px;">
        ${message}
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error('❌ Email sending failed:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// --- Manual test function ---
// Run this function independently to test email sending without the API
async function sendTestEmail() {
  const testMailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
    subject: 'Test Email from Nodemailer Setup',
    text: 'This is a test email to verify Nodemailer configuration.',
  };

  try {
    const info = await transporter.sendMail(testMailOptions);
    console.log('✅ Test email sent:', info.response);
  } catch (error) {
    console.error('❌ Failed to send test email:', error);
  }
}

// Uncomment below to run a manual test directly
// sendTestEmail();

module.exports = router;
