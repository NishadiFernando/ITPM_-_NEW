const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Submission = require('../models/Submission');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Create new submission
router.post('/', upload.single('sareeImage'), async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['fullName', 'contactNumber', 'email', 'address', 'numberOfSaree', 
                          'sareeCondition', 'materialType', 'preferredDate', 'preferredTime', 
                          'preferredBranch'];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const submissionData = {
      ...req.body,
      sareeImage: req.file ? `/uploads/${req.file.filename}` : null,
      status: 'Pending',
      submissionDate: new Date()
    };

    const submission = new Submission(submissionData);
    await submission.save();

    res.status(201).json({
      success: true,
      submissionId: submission._id,
      message: 'Submission created successfully'
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating submission',
      error: error.message
    });
  }
});

// Get all submissions
router.get('/', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ submissionDate: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
      error: error.message
    });
  }
});

// Get submission by ID
router.get('/:id', async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching submission',
      error: error.message
    });
  }
});

// Update submission status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.json({
      success: true,
      submission,
      message: 'Status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating status',
      error: error.message
    });
  }
});

// Delete submission
router.delete('/:id', async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Only allow deletion of pending submissions
    if (submission.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending submissions can be deleted'
      });
    }

    // Delete the image file if it exists
    if (submission.sareeImage) {
      const imagePath = path.join(__dirname, '..', submission.sareeImage);
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error('Error deleting image file:', err);
      }
    }

    await Submission.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting submission',
      error: error.message
    });
  }
});

module.exports = router; 