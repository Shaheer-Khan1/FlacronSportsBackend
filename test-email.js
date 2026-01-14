const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmailConnection() {
  // Create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    // Verify connection configuration
    console.log('Testing email connection...');
    await transporter.verify();
    console.log('✅ Email connection successful!');

    // Send a test email
    console.log('\nSending test email...');
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email from Flacron Sports Backend',
      text: 'If you receive this email, your Nodemailer configuration is working correctly!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Test Email</h1>
          <p>If you receive this email, your Nodemailer configuration is working correctly!</p>
          <p>Sent at: ${new Date().toISOString()}</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'EAUTH') {
      console.log('\nAuthentication failed. Please check:');
      console.log('1. Your EMAIL_USER and EMAIL_PASSWORD in .env file');
      console.log('2. If using Gmail, make sure you\'re using an App Password');
      console.log('   - Enable 2-Step Verification in your Google Account');
      console.log('   - Go to Security > App Passwords');
      console.log('   - Generate a new app password for "Mail"');
    }
  }
}

// Run the test
testEmailConnection(); 