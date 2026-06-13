import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';
import products from './data/products.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('admin123', salt);
    const listerPass = await bcrypt.hash('lister123', salt);
    const custPass = await bcrypt.hash('customer123', salt);

    await User.insertMany([
      {
        name: 'Admin',
        email: 'devilrao125@gmail.com',
        password: admin123,
        role: 'admin',
      },
      {
        name: 'Lister User',
        email: 'lister@ecomhutt.com',
        password: listerPass,
        role: 'lister',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: custPass,
        role: 'customer',
      }
    ]);

    await Product.insertMany(products);

    console.log('\n✅ Data Imported Successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 LOGIN CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 Admin:    devilrao125@gmail.com   / admin123');
    console.log('📋 Lister:   lister@ecomhutt.com  / lister123');
    console.log('🛍️  Customer: john@example.com     / customer123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};


const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
