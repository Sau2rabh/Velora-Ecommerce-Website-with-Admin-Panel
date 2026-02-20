const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Admin ID from seeder (hashed/random, so we might need to fetch user or just use a placeholder if we want to test signature only)
// But to test authMiddleware, we need a valid User ID that exists in DB.
// Let's first fetch the admin user ID.

const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

connectDB();

const getToken = async () => {
    try {
        const user = await User.findOne({ email: 'admin@example.com' });
        if (user) {
            console.log('Admin Token:', generateToken(user._id));
        } else {
            console.log('Admin user not found. Run seeder first.');
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

getToken();
