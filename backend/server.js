const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// Import models
const Saree = require('./models/Saree');
const Tailor = require('./models/Tailor');
const CustomizationRequest = require('./models/CustomizationRequest');

// Import routes
const customizationRequestsRouter = require('./routes/customizationRequests');
const tailorsRouter = require('./routes/tailors');
const dashboardRoutes = require('./routes/dashboard');
const emailRoutes = require('./routes/email');
const customizationRoutes = require('./routes/customization');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/tailors', express.static(path.join(__dirname, 'uploads/tailors')));
app.use('/uploads/customization', express.static(path.join(__dirname, 'uploads/customization')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/punarvasthra', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Multer Setup for File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Create required directories
const dirs = ['uploads', 'uploads/tailors', 'uploads/customization'];
dirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!require('fs').existsSync(dirPath)) {
        require('fs').mkdirSync(dirPath, { recursive: true });
    }
});

// Routes
app.use('/api/customization-requests', customizationRequestsRouter);
app.use('/api/tailors', tailorsRouter);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', emailRoutes);
app.use('/api/customization', customizationRoutes);
app.use('/api', orderRoutes);

// Get all sarees
app.get('/api/sarees', async (req, res) => {
    try {
        const sarees = await Saree.find();
        res.json(sarees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new saree
app.post('/api/sarees', upload.single('image'), async (req, res) => {
    try {
        const saree = new Saree({
            sareeId: req.body.sareeId,
            addedDate: req.body.addedDate,
            title: req.body.title,
            price: req.body.price,
            salePrice: req.body.salePrice || null,
            mainColor: req.body.mainColor,
            fabric: req.body.fabric,
            color: req.body.color,
            stockAvailability: req.body.stockAvailability,
            stock: req.body.stock,
            customization: req.body.customization,
            designPattern: req.body.designPattern,
            embroideryStyle: req.body.embroideryStyle,
            description: req.body.description,
            occasion: req.body.occasion,
            image: req.file ? `/uploads/${req.file.filename}` : null,
        });
        await saree.save();
        res.status(201).json(saree);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a saree
app.put('/api/sarees/:id', upload.single('image'), async (req, res) => {
    try {
        const saree = await Saree.findById(req.params.id);
        if (!saree) {
            return res.status(404).json({ message: 'Saree not found' });
        }

        saree.sareeId = req.body.sareeId || saree.sareeId;
        saree.addedDate = req.body.addedDate || saree.addedDate;
        saree.title = req.body.title || saree.title;
        saree.price = req.body.price || saree.price;
        saree.salePrice = req.body.salePrice || null;
        saree.mainColor = req.body.mainColor || saree.mainColor;
        saree.fabric = req.body.fabric || saree.fabric;
        saree.color = req.body.color || saree.color;
        saree.stockAvailability = req.body.stockAvailability || saree.stockAvailability;
        saree.stock = req.body.stock || saree.stock;
        saree.customization = req.body.customization || saree.customization;
        saree.designPattern = req.body.designPattern || saree.designPattern;
        saree.embroideryStyle = req.body.embroideryStyle || saree.embroideryStyle;
        saree.description = req.body.description || saree.description;
        saree.occasion = req.body.occasion || saree.occasion;
        if (req.file) {
            saree.image = `/uploads/${req.file.filename}`;
        }

        await saree.save();
        res.json(saree);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a saree
app.delete('/api/sarees/:id', async (req, res) => {
    try {
        const saree = await Saree.findById(req.params.id);
        if (!saree) {
            return res.status(404).json({ message: 'Saree not found' });
        }

        await saree.deleteOne();
        res.json({ message: 'Saree deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Tailor Routes
app.get('/api/tailors', async (req, res) => {
    try {
        const tailors = await Tailor.find();
        res.json(tailors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/tailors/active', async (req, res) => {
    try {
        const tailors = await Tailor.find({ status: 'Active' });
        res.json(tailors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/tailors', upload.single('profileImage'), async (req, res) => {
    try {
        const tailor = new Tailor({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            specialization: req.body.specialization,
            profileImage: req.file ? `/uploads/${req.file.filename}` : null,
            status: req.body.status
        });
        await tailor.save();
        res.status(201).json(tailor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Customization Request Routes
app.get('/api/customization-requests', async (req, res) => {
    try {
        const requests = await CustomizationRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/customization-requests', upload.array('images', 5), async (req, res) => {
    try {
        const request = new CustomizationRequest({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            material: req.body.material,
            colorDescription: req.body.colorDescription,
            specialNotes: req.body.specialNotes,
            tailor: req.body.tailor,
            productType: req.body.productType,
            measurements: JSON.parse(req.body.measurements),
            isWebsiteItem: req.body.isWebsiteItem === 'true',
            itemId: req.body.itemId,
            images: req.files ? req.files.map(file => `/uploads/${file.filename}`) : []
        });
        await request.save();
        res.status(201).json(request);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/customization-requests/:id', async (req, res) => {
    try {
        const request = await CustomizationRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        Object.assign(request, req.body);
        await request.save();
        res.json(request);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/customization-requests/:id', async (req, res) => {
    try {
        const request = await CustomizationRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        await request.deleteOne();
        res.json({ message: 'Request deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Email service configured with:', process.env.EMAIL_USER);
});
