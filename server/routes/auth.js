const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  businessName: user.businessName,
  email: user.email,
  phone: user.phone,
  image: user.image,
  address: user.address,
  city: user.city,
  state: user.state,
  country: user.country,
  pincode: user.pincode,
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      businessName,
      email,
      password,
      phone,
      image,
      address,
      city,
      state,
      country,
      pincode,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      businessName,
      email,
      password: hashedPassword,
      phone,
      image,
      address,
      city,
      state,
      country,
      pincode,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: buildUserResponse(newUser),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    res.json({
      success: true,
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Update profile route
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const {
      name,
      businessName,
      email,
      phone,
      image,
      address,
      city,
      state,
      country,
      pincode,
    } = req.body;

    if (email && email !== currentUser.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      currentUser.email = email;
    }

    if (name !== undefined) currentUser.name = name;
    if (businessName !== undefined) currentUser.businessName = businessName;
    if (phone !== undefined) currentUser.phone = phone;
    if (image !== undefined) currentUser.image = image;
    if (address !== undefined) currentUser.address = address;
    if (city !== undefined) currentUser.city = city;
    if (state !== undefined) currentUser.state = state;
    if (country !== undefined) currentUser.country = country;
    if (pincode !== undefined) currentUser.pincode = pincode;

    await currentUser.save();

    res.json({
      success: true,
      user: buildUserResponse(currentUser),
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Server error while updating profile' });
  }
});

module.exports = router;

