const express = require('express');
const router = express.Router();
const Tailor = require('../models/Tailor');
const multer = require('multer');
const path = require('path');

// Multer setup for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/tailors/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get all tailors
router.get('/', async (req, res) => {
  try {
    const tailors = await Tailor.find().sort({ createdAt: -1 });
    res.json(tailors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active tailors (for user interface)
router.get('/active', async (req, res) => {
  try {
    const tailors = await Tailor.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.json(tailors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single tailor
router.get('/:id', async (req, res) => {
  try {
    const tailor = await Tailor.findById(req.params.id);
    if (!tailor) {
      return res.status(404).json({ message: 'Tailor not found' });
    }
    res.json(tailor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new tailor
router.post('/', upload.single('profileImage'), async (req, res) => {
  try {
    console.log('Received tailor data:', req.body); // Debug log
    
    // Parse the specialization JSON string back to array
    const specialization = req.body.specialization ? JSON.parse(req.body.specialization) : [];
    
    const tailor = new Tailor({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      specialization: specialization,
      status: req.body.status || 'Active',
      profileImage: req.file ? `/uploads/tailors/${req.file.filename}` : null
    });

    console.log('Creating tailor with data:', tailor); // Debug log

    const newTailor = await tailor.save();
    console.log('Saved tailor:', newTailor); // Debug log
    res.status(201).json(newTailor);
  } catch (error) {
    console.error('Error creating tailor:', error); // Debug log
    res.status(400).json({ message: error.message });
  }
});

// Update a tailor
router.put('/:id', upload.single('profileImage'), async (req, res) => {
  try {
    console.log('Update request received:', req.body); // Debug log
    
    const tailor = await Tailor.findById(req.params.id);
    if (!tailor) {
      return res.status(404).json({ message: 'Tailor not found' });
    }

    // Parse the specialization JSON string back to array
    const specialization = req.body.specialization ? JSON.parse(req.body.specialization) : tailor.specialization;

    // Update all fields
    tailor.name = req.body.name || tailor.name;
    tailor.email = req.body.email || tailor.email;
    tailor.phone = req.body.phone || tailor.phone;
    tailor.address = req.body.address || tailor.address;
    tailor.specialization = specialization;
    tailor.status = req.body.status || tailor.status;
    
    if (req.file) {
      tailor.profileImage = `/uploads/tailors/${req.file.filename}`;
    }

    console.log('Updating tailor with data:', tailor); // Debug log

    const updatedTailor = await tailor.save();
    console.log('Updated tailor:', updatedTailor); // Debug log
    res.json(updatedTailor);
  } catch (error) {
    console.error('Error updating tailor:', error); // Debug log
    res.status(400).json({ message: error.message });
  }
});

// Delete a tailor
router.delete('/:id', async (req, res) => {
  try {
    const tailor = await Tailor.findById(req.params.id);
    if (!tailor) {
      return res.status(404).json({ message: 'Tailor not found' });
    }
    await tailor.deleteOne();
    res.json({ message: 'Tailor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tailors by specialization
router.get('/specialization/:spec', async (req, res) => {
  try {
    const tailors = await Tailor.find({
      specialization: req.params.spec,
      status: 'Active'
    }).sort({ createdAt: -1 });
    res.json(tailors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 