const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/analytics
// @access  Private/Admin
// @desc    Get dashboard stats
// @route   GET /api/analytics
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();

  const orders = await Order.find();
  const totalRevenue = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);

  const { range } = req.query;
  const matchStage = { $match: { isPaid: true } };
  let groupStage;

  if (range === 'day') {
    groupStage = {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
        total: { $sum: "$totalPrice" }
      }
    };
  } else if (range === 'year') {
    groupStage = {
      $group: {
        _id: { $year: "$paidAt" },
        total: { $sum: "$totalPrice" }
      }
    };
  } else {
    // Default to month
    groupStage = {
      $group: {
        _id: { $month: "$paidAt" },
        total: { $sum: "$totalPrice" }
      }
    };
  }

  const monthlyRevenue = await Order.aggregate([
    matchStage,
    groupStage,
    { $sort: { _id: 1 } }
  ]);

  // Format monthly revenue for charts (ensure all months are present or just return data)
  // For simplicity, returning raw data. Frontend can format it.

  // Calculate sales by category
  const salesByCategory = await Product.aggregate([
    {
      $group: {
         _id: "$category",
         count: { $sum: 1 }
      }
    }
  ]);

  console.log('Stats:', { totalProducts, totalUsers, totalOrders, totalRevenue }); // Debug log

  res.json({
    totalProducts,
    totalUsers,
    totalOrders,
    totalRevenue,
    monthlyRevenue,
    salesByCategory
  });
});

module.exports = {
  getDashboardStats,
};
