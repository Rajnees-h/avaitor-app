const nodemailer = require('nodemailer');

async function sendEmail(message) {
  // Configure transporter for Gmail
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'raj1225288@gmail.com',
      pass: 'wzlpduiqlfeckkob' // App Password
    }
  });

  // Email content
  let info = await transporter.sendMail({
    from: '"JS Script" <raj1225288@gmail.com>',
    to: 'raj1225288@gmail.com',
    subject: '📄 Message from your JS script',
    text: message || 'Hey Rajneesh! This is your personal alert from Node.js 🚀'
  });

  console.log('✅ Email sent:', info.messageId);
}

module.exports = sendEmail; // Export the function for use in other files
