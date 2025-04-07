const express = require('express');
const router = express.Router();
const CustomizationRequest = require('../models/CustomizationRequest');
const Tailor = require('../models/Tailor');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalTailors = await Tailor.countDocuments();
    const totalOrders = await CustomizationRequest.countDocuments();
    const completedOrders = await CustomizationRequest.countDocuments({ status: 'completed' });
    const pendingOrders = await CustomizationRequest.countDocuments({ status: 'pending' });

    res.json({
      totalTailors,
      totalOrders,
      completedOrders,
      pendingOrders
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
});

// Get product distribution
router.get('/product-distribution', async (req, res) => {
  try {
    const distribution = await CustomizationRequest.aggregate([
      {
        $group: {
          _id: '$productType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(distribution);
  } catch (error) {
    console.error('Error fetching product distribution:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product distribution',
      error: error.message
    });
  }
});

// Get recent orders
router.get('/recent-orders', async (req, res) => {
  try {
    const recentOrders = await CustomizationRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('assignedTailor', 'name');

    res.json(recentOrders);
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent orders',
      error: error.message
    });
  }
});

// Get top performing tailors
router.get('/top-tailors', async (req, res) => {
  try {
    const topTailors = await CustomizationRequest.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: '$assignedTailor',
          ordersCompleted: { $sum: 1 }
        }
      },
      {
        $sort: { ordersCompleted: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Populate tailor details
    const tailorIds = topTailors.map(t => t._id);
    const tailors = await Tailor.find({ _id: { $in: tailorIds } });

    const result = topTailors.map(t => {
      const tailor = tailors.find(tr => tr._id.equals(t._id));
      return {
        _id: t._id,
        name: tailor ? tailor.name : 'Unknown Tailor',
        ordersCompleted: t.ordersCompleted
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching top tailors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top tailors',
      error: error.message
    });
  }
});

module.exports = router; 