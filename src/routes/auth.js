
import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import axios from 'axios';
const router = express.Router();




// POST /auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { phone, otp, newPassword } = req.body;
  if (!phone || !otp || !newPassword) {
    return res.status(400).json({ error: 'Phone, OTP, and new password are required' });
  }
  try {
    // Check OTP
    if (!global.otpStore || !global.otpStore[phone]) {
      console.error(`[RESET PASSWORD] OTP not found or expired for phone: ${phone}`);
      return res.status(400).json({ error: 'OTP not found or expired' });
    }
    const otpRecord = global.otpStore[phone];
    if (Date.now() > otpRecord.expires) {
      delete global.otpStore[phone];
      console.error(`[RESET PASSWORD] OTP expired for phone: ${phone}`);
      return res.status(400).json({ error: 'OTP expired' });
    }
    if (otpRecord.otp !== otp) {
      console.error(`[RESET PASSWORD] Invalid OTP for phone: ${phone}, provided: ${otp}, expected: ${otpRecord.otp}`);
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    // Update password
    const bcrypt = (await import('bcryptjs')).default;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOne({ where: { PhoneNumber: phone } });
    if (!user) {
      console.error(`[RESET PASSWORD] User not found for phone: ${phone}`);
      return res.status(404).json({ error: 'User not found' });
    }
    user.Password = hashedPassword;
    await user.save();
    delete global.otpStore[phone];
    console.log(`[RESET PASSWORD] Password reset successful for phone: ${phone}`);
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error('[RESET PASSWORD] Server error:', err);
    res.status(500).json({ error: 'Server error', details: err && err.message ? err.message : err });
  }
});

// POST /auth/send-reset-otp
router.post('/send-reset-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }
  try {
    // Find user by phone
    const user = await User.findOne({ where: { PhoneNumber: phone } });
    if (!user) {
      console.error(`[SEND RESET OTP] User not found for phone: ${phone}`);
      return res.status(404).json({ error: 'User not found' });
    }
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Store OTP in memory (for demo; use Redis or DB in production)
    if (!global.otpStore) global.otpStore = {};
    global.otpStore[phone] = { otp, expires: Date.now() + 5 * 60 * 1000 };
    // For development: send OTP in response (do not use in production)
    console.log(`[SEND RESET OTP] OTP for ${phone}: ${otp}`);
    res.json({ success: true, message: 'OTP sent (dev mode)', otp });
  } catch (err) {
    console.error('[SEND RESET OTP] Server error:', err);
    res.status(500).json({ error: 'Server error', details: err && err.message ? err.message : err });
  }
});

// POST /auth/register
router.post('/register', async (req, res) => {
  const { username, name, email, address, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ error: 'Name, email, password and phone are required' });
  }

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { Email: email },
          { Username: username }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email or Username already in use' });
    }

    // Hash the password before saving
    const bcrypt = (await import('bcryptjs')).default;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      Username: username,
      FirstName: name,
      Email: email,
      Address: address,
      Password: hashedPassword,
      PhoneNumber: phone
    });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, phone, password } = req.body;
  if ((!email && !phone) || !password) {
    return res.status(400).json({ error: 'Phone number or email and password are required' });
  }
  try {
    const bcrypt = (await import('bcryptjs')).default;
    let user;
    if (phone) {
      user = await User.findOne({ where: { PhoneNumber: phone } });
    } else if (email) {
      user = await User.findOne({ where: { Email: email } });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.Password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user.UserID, email: user.Email, phone: user.PhoneNumber },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
