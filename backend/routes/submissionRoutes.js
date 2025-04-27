const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const { sendApprovalEmail } = require('../utils/emailService');

// Get all submissions
router.get('/', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ submissionDate: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update submission status
router.patch('/:id/status', async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const oldStatus = submission.status;
    submission.status = req.body.status;

    // Send email notification if status is changed to "Approved"
    if (req.body.status === 'Approved' && oldStatus !== 'Approved') {
      submission.emailStatus = 'pending';
      try {
        const emailSent = await sendApprovalEmail(submission);
        submission.emailStatus = emailSent ? 'sent' : 'failed';
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
        submission.emailStatus = 'failed';
      }
    }

    const updatedSubmission = await submission.save();
    res.json(updatedSubmission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete submission
router.delete('/:id', async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    await submission.remove();
    res.json({ message: 'Submission deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send/Retry email notification
router.post('/:id/send-email', async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Only allow sending emails for approved submissions
    if (submission.status !== 'Approved') {
      return res.status(400).json({ 
        message: 'Can only send email notifications for approved submissions' 
      });
    }

    submission.emailStatus = 'pending';
    await submission.save();

    try {
      const emailSent = await sendApprovalEmail(submission);
      
      submission.emailStatus = emailSent ? 'sent' : 'failed';
      submission.emailSentAt = emailSent ? new Date() : null;
      await submission.save();

      if (emailSent) {
        res.json({ 
          message: 'Email sent successfully',
          emailStatus: 'sent',
          emailSentAt: submission.emailSentAt
        });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
      submission.emailStatus = 'failed';
      await submission.save();
      
      res.status(500).json({ 
        message: 'Failed to send email notification',
        emailStatus: 'failed',
        error: emailError.message
      });
    }
  } catch (err) {
    console.error('Error in send-email route:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 