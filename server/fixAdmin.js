/**
 * One-time fix script: Restore admin role for devilrao125@gmail.com
 * Run with: node fixAdmin.js
 * Safe to delete after running.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();
await connectDB();

const email = 'devilrao125@gmail.com';

const user = await User.findOne({ email });

if (!user) {
  console.log(`❌ User not found: ${email}`);
  process.exit(1);
}

console.log('📋 Current state:');
console.log(`   Name  : ${user.name}`);
console.log(`   Email : ${user.email}`);
console.log(`   role  : ${user.role}`);
console.log(`   roles : ${JSON.stringify(user.roles)}`);

// Fix both role and roles array
user.role = 'admin';
user.roles = ['admin'];
user.isVerified = true;

await user.save();

console.log('\n✅ Fixed! New state:');
console.log(`   role  : ${user.role}`);
console.log(`   roles : ${JSON.stringify(user.roles)}`);
console.log(`   isVerified: ${user.isVerified}`);

await mongoose.disconnect();
process.exit(0);
