const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP configuration error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// Route to send tailor details email
router.post('/send-tailor-email', async (req, res) => {
  try {
    const {
      customerEmail,
      customerName,
      tailorName,
      tailorEmail,
      tailorPhone,
      tailorAddress,
      tailorSpecialization
    } = req.body;

    // Validate required fields
    if (!customerEmail || !tailorName || !tailorEmail || !tailorPhone) {
      console.error('Missing required fields:', { customerEmail, tailorName, tailorEmail, tailorPhone });
      return res.status(400).json({ message: 'Missing required fields for email' });
    }

    console.log('Preparing to send email with following details:');
    console.log('From:', process.env.EMAIL_USER);
    console.log('To:', customerEmail);
    console.log('Tailor:', tailorName);

    // Email content
    const mailOptions = {
      from: `"Punarvasthra" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: 'Your Selected Tailor Details - Punarvasthra',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4F032A;">Dear ${customerName},</h2>
          <p>Thank you for choosing Punarvasthra for your customization needs. Here are the details of your selected tailor:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #4F032A; margin-bottom: 15px;">Tailor Information:</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin-bottom: 10px;"><strong>Name:</strong> ${tailorName}</li>
              <li style="margin-bottom: 10px;"><strong>Email:</strong> ${tailorEmail}</li>
              <li style="margin-bottom: 10px;"><strong>Phone:</strong> ${tailorPhone}</li>
              <li style="margin-bottom: 10px;"><strong>Address:</strong> ${tailorAddress || 'Not provided'}</li>
              <li style="margin-bottom: 10px;"><strong>Specialization:</strong> ${tailorSpecialization || 'Not specified'}</li>
            </ul>
          </div>

          <p>You can contact your tailor directly for any queries regarding your customization request.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666;">Best regards,<br>Punarvasthra Team</p>
          </div>
        </div>
      `
    };

    console.log('Attempting to send email...');

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response
    });
    res.status(500).json({ 
      message: 'Failed to send email',
      error: error.message || 'Unknown error occurred'
    });
  }
});

module.exports = router; 