const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const Product = require('./models/Product');

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

const seedOrders = async () => {
    await connectDB();

    try {
        const users = await User.find({});
        const products = await Product.find({});

        if (users.length === 0 || products.length === 0) {
            console.log('No users or products found to create orders');
            process.exit();
        }

        const orders = [];
        const statuses = [true, false]; // isPaid, isDelivered

        for (let i = 0; i < 10; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            
            const order = {
                user: randomUser._id,
                orderItems: [
                    {
                        name: randomProduct.name,
                        qty: 1,
                        image: randomProduct.image,
                        price: randomProduct.price,
                        product: randomProduct._id
                    }
                ],
                shippingAddress: {
                    address: '123 Fake St',
                    city: 'Springfield',
                    postalCode: '12345',
                    country: 'USA'
                },
                paymentMethod: 'PayPal',
                itemsPrice: randomProduct.price,
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: randomProduct.price,
                isPaid: statuses[Math.floor(Math.random() * statuses.length)],
                paidAt: new Date(),
                isDelivered: statuses[Math.floor(Math.random() * statuses.length)],
                deliveredAt: new Date(),
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)) // Random date in past
            };
            orders.push(order);
        }

        await Order.insertMany(orders);
        console.log('Orders Seeded!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedOrders();
