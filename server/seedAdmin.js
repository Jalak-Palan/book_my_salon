require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@stockify.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      businessName: 'Stock Management',
      email: 'admin@stockify.com',
      password: hashedPassword,
      phone: '+1 555-0100',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60',
      address: '123 Market Street',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      pincode: '94103'
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@stockify.com');
    console.log('Password: password123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
