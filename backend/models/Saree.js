const mongoose = require('mongoose');

const sareeSchema = new mongoose.Schema({
    sareeId: {
        type: String,
        required: true,
        unique: true
    },
    addedDate: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    salePrice: {
        type: Number,
        min: 0,
        default: null
    },
    mainColor: {
        type: String,
        required: true,
        enum: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Orange', 'Brown', 'Black', 'White', 'Gold', 'Silver']
    },
    color: {
        type: String,
        required: true
    },
    fabric: {
        type: String,
        required: true,
        enum: [
            'Cotton Sarees',
            'Silk Sarees',
            'Linen Sarees',
            'Georgette Sarees',
            'Chiffon Sarees',
            'Crepe Sarees',
            'Net Sarees',
            'Banarasi Sarees',
            'Kanchipuram Sarees',
            'Bathik'
        ]
    },
    stockAvailability: {
        type: String,
        required: true,
        enum: ['In Stock', 'Out of Stock', 'Low Stock', 'Reserved']
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    customization: {
        type: String,
        required: true,
        enum: ['Yes', 'No']
    },
    description: {
        type: String,
        required: true
    },
    occasion: {
        type: String,
        required: true,
        enum: ['Wedding', 'Party', 'Casual', 'Festive', 'Formal', 'Sale']
    },
    designPattern: {
        type: String,
        required: true
    },
    embroideryStyle: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Saree', sareeSchema);