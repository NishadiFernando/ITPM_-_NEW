const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Saree = require('../models/Saree');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// CRUD Routes
// Create a saree with image upload
router.post('/', upload.single('image'), async (req, res) => {
    const { title, price, fabric, color, stock, description, occasion } = req.body;
    const saree = new Saree({
        title,
        price,
        fabric,
        color,
        stock,
        description,
        occasion,
        image: req.file ? `/uploads/${req.file.filename}` : '',
    });
    await saree.save();
    res.status(201).json(saree);
});

// Read all sarees
router.get('/', async (req, res) => {
    const sarees = await Saree.find();
    res.json(sarees);
});

// Update a saree
router.put('/:id', async (req, res) => {
    const saree = await Saree.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(saree);
});

// Delete a saree
router.delete('/:id', async (req, res) => {
    await Saree.findByIdAndDelete(req.params.id);
    res.json({ message: 'Saree deleted' });
});

module.exports = router;