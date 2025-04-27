const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  numberOfSaree: {
    type: String,
    required: true
  },
  sareeCondition: {
    type: String,
    required: true
  },
  materialType: {
    type: String,
    required: true
  },
  sareeImage: {
    type: String, // URL to the uploaded image
  },
  preferredDate: {
    type: String,
    required: true
  },
  preferredTime: {
    type: String,
    required: true
  },
  preferredBranch: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  },
  emailStatus: {
    type: String,
    enum: ['sent', 'failed', 'pending', null],
    default: null
  },
  emailSentAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema); 