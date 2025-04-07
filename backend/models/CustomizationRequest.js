const mongoose = require('mongoose');

const customizationRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  material: {
    type: String,
    required: true
  },
  colorDescription: {
    type: String,
    required: true
  },
  specialNotes: {
    type: String,
    default: ''
  },
  tailor: {
    type: String,
    required: true
  },
  productType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  images: [{
    type: String
  }],
  measurements: {
    type: Object,
    required: true
  },
  isWebsiteItem: {
    type: Boolean,
    default: false
  },
  itemId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
customizationRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CustomizationRequest', customizationRequestSchema); 