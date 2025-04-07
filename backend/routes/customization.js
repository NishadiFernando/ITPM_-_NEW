const express = require('express');
const router = express.Router();
const CustomizationRequest = require('../models/CustomizationRequest');

// Create a new customization request
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      material,
      colorDescription,
      additionalNotes,
      selectedTailor,
      productType
    } = req.body;

    const customizationRequest = new CustomizationRequest({
      name,
      email,
      phone,
      address,
      material,
      colorDescription,
      additionalNotes,
      assignedTailor: selectedTailor,
      productType,
      status: 'pending'
    });

    await customizationRequest.save();
    res.status(201).json({
      success: true,
      message: 'Customization request created successfully',
      data: customizationRequest
    });
  } catch (error) {
    console.error('Error creating customization request:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating customization request',
      error: error.message
    });
  }
});

// Get all customization requests
router.get('/', async (req, res) => {
  try {
    const requests = await CustomizationRequest.find()
      .populate('assignedTailor', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching customization requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customization requests',
      error: error.message
    });
  }
});

// Get a specific customization request
router.get('/:id', async (req, res) => {
  try {
    const request = await CustomizationRequest.findById(req.params.id)
      .populate('assignedTailor', 'name specialization');
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Customization request not found'
      });
    }
    res.json(request);
  } catch (error) {
    console.error('Error fetching customization request:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customization request',
      error: error.message
    });
  }
});

// Update a customization request
router.put('/:id', async (req, res) => {
  try {
    const request = await CustomizationRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTailor', 'name specialization');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Customization request not found'
      });
    }

    res.json({
      success: true,
      message: 'Customization request updated successfully',
      data: request
    });
  } catch (error) {
    console.error('Error updating customization request:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating customization request',
      error: error.message
    });
  }
});

// Delete a customization request
router.delete('/:id', async (req, res) => {
  try {
    const request = await CustomizationRequest.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Customization request not found'
      });
    }
    res.json({
      success: true,
      message: 'Customization request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customization request:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting customization request',
      error: error.message
    });
  }
});

module.exports = router; 