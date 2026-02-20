const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const MONGO_URI = 'mongodb+srv://royalking6993_db_user:lPsLFHBPW03gt3lb@veloracluster.dgnkzkg.mongodb.net/?appName=VeloraCluster';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const checkData = async () => {
  await connectDB();

  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();

    console.log(`Users: ${userCount}`);
    console.log(`Products: ${productCount}`);
    console.log(`Orders: ${orderCount}`);

    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

checkData();
