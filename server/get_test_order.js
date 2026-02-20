const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

const getOrder = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const order = await Order.findOne({}).populate('user', 'email');
    if (order) {
      console.log(`ORDER_ID: ${order._id}`);
      console.log(`ORDER_EMAIL: ${order.shippingAddress.email || order.user.email}`);
    } else {
      console.log('No orders found');
    }
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

getOrder();
