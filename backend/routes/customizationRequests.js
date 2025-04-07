const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const CustomizationRequest = require('../models/CustomizationRequest');
const Tailor = require('../models/Tailor');
const emailService = require('../services/emailService');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/customization/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get all customization requests
router.get('/', async (req, res) => {
  try {
    const requests = await CustomizationRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single customization request
router.get('/:id', async (req, res) => {
  try {
    const request = await CustomizationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new customization request with file upload
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received files:', req.files);

    // Process uploaded files
    const imageUrls = req.files ? req.files.map(file => `/uploads/customization/${file.filename}`) : [];
    
    // Parse measurements from string to object
    let measurements;
    try {
      measurements = JSON.parse(req.body.measurements);
    } catch (error) {
      console.error('Error parsing measurements:', error);
      return res.status(400).json({ message: 'Invalid measurements format' });
    }

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'address', 'material', 'colorDescription', 'tailor'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Get tailor details
    const tailor = await Tailor.findById(req.body.tailor);
    if (!tailor) {
      return res.status(400).json({ message: 'Selected tailor not found' });
    }

    const request = new CustomizationRequest({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      productType: req.body.productType,
      material: req.body.material,
      colorDescription: req.body.colorDescription,
      measurements: measurements,
      specialNotes: req.body.specialNotes || '',
      tailor: req.body.tailor,
      isWebsiteItem: req.body.isWebsiteItem === 'true',
      itemId: req.body.itemId || '',
      images: imageUrls,
      status: 'pending'
    });

    console.log('Creating request with data:', request);

    const newRequest = await request.save();
    console.log('Request saved successfully:', newRequest);

    // Send emails to both customer and tailor
    try {
      // Send tailor details to customer
      await emailService.sendTailorDetailsToCustomer(
        request.email,
        request.name,
        tailor
      );

      // Send order confirmation emails
      await emailService.sendOrderConfirmation(
        request.email,
        request.name,
        tailor,
        {
          orderId: newRequest._id,
          productType: request.productType,
          material: request.material,
          status: 'Pending'
        }
      );

      console.log('Emails sent successfully');
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Don't fail the request if email sending fails
    }

    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a customization request
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    console.log('Update request received:', {
      body: req.body,
      files: req.files,
      id: req.params.id
    });

    const request = await CustomizationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Process new uploaded files if any
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(file => `/uploads/customization/${file.filename}`);
      request.images = [...(request.images || []), ...newImageUrls];
    }

    // Handle measurements update
    if (req.body.measurements) {
      try {
        const measurements = JSON.parse(req.body.measurements);
        request.measurements = measurements;
      } catch (error) {
        console.error('Error parsing measurements:', error);
        return res.status(400).json({ message: 'Invalid measurements format' });
      }
    }

    // Update basic fields
    const updateFields = [
      'name', 
      'email', 
      'phone', 
      'address', 
      'productType', 
      'material', 
      'colorDescription', 
      'specialNotes', 
      'tailor', 
      'status'
    ];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        request[field] = req.body[field];
      }
    });

    // Handle boolean and optional fields
    if (req.body.isWebsiteItem !== undefined) {
      request.isWebsiteItem = req.body.isWebsiteItem === 'true';
    }
    if (req.body.itemId !== undefined) {
      request.itemId = req.body.itemId;
    }

    console.log('Saving updated request:', request);
    const updatedRequest = await request.save();
    console.log('Request updated successfully:', updatedRequest);
    res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(400).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Delete a customization request
router.delete('/:id', async (req, res) => {
  try {
    console.log('Attempting to delete request:', req.params.id);
    const request = await CustomizationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    await CustomizationRequest.deleteOne({ _id: req.params.id });
    console.log('Request deleted successfully');
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get requests by status
router.get('/status/:status', async (req, res) => {
  try {
    const requests = await CustomizationRequest.find({ status: req.params.status }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get requests by tailor
router.get('/tailor/:tailor', async (req, res) => {
  try {
    const requests = await CustomizationRequest.find({ tailor: req.params.tailor }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get requests for a specific tailor with optional status filter
router.get('/tailor/:tailorId', async (req, res) => {
  try {
    const { status } = req.query;
    const query = { tailor: req.params.tailorId };
    
    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    const requests = await CustomizationRequest.find(query)
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update request status
router.patch('/:requestId/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: pending, in_progress, completed, cancelled' 
      });
    }

    const request = await CustomizationRequest.findByIdAndUpdate(
      req.params.requestId,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 