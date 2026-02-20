const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const getOrder = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const order = await db.collection('orders').findOne({});
    if (order) {
      console.log(`ORDER_ID: ${order._id}`);
      // Find user to get email
      const user = await db.collection('users').findOne({ _id: order.user });
      console.log(`ORDER_EMAIL: ${order.shippingAddress.email || user.email}`);
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
