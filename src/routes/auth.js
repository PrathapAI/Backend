
import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import axios from 'axios';
import { generateOTP, sendOTPEmail } from '../config/email.js';
import { register, login } from '../controllers/authController.js';
const router = express.Router();




// POST /auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, OTP, and new password are required' });
  }
  try {
    // Check OTP
    if (!global.otpStore || !global.otpStore[email]) {
      console.error(`[RESET PASSWORD] OTP not found or expired for email: ${email}`);
      return res.status(400).json({ error: 'OTP not found or expired' });
    }
    const otpRecord = global.otpStore[email];
    if (Date.now() > otpRecord.expires) {
      delete global.otpStore[email];
      console.error(`[RESET PASSWORD] OTP expired for email: ${email}`);
      return res.status(400).json({ error: 'OTP expired' });
    }
    if (otpRecord.otp !== otp) {
      console.error(`[RESET PASSWORD] Invalid OTP for email: ${email}, provided: ${otp}, expected: ${otpRecord.otp}`);
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    // Update password
    const bcrypt = (await import('bcryptjs')).default;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOne({ where: { Email: email } });
    if (!user) {
      console.error(`[RESET PASSWORD] User not found for email: ${email}`);
      return res.status(404).json({ error: 'User not found' });
    }
    user.Password = hashedPassword;
    await user.save();
    delete global.otpStore[email];
    console.log(`[RESET PASSWORD] Password reset successful for email: ${email}`);
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error('[RESET PASSWORD] Server error:', err);
    res.status(500).json({ error: 'Server error', details: err && err.message ? err.message : err });
  }
});

// POST /auth/send-reset-otp
router.post('/send-reset-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    // Find user by email
    const user = await User.findOne({ where: { Email: email } });
    if (!user) {
      console.error(`[SEND RESET OTP] User not found for email: ${email}`);
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP in memory (for demo; use Redis or DB in production)
    if (!global.otpStore) global.otpStore = {};
    global.otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };
    
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('[SEND RESET OTP] Email not configured - using dev mode');
      console.log(`[SEND RESET OTP] DEV MODE - OTP for ${email}: ${otp}`);
      return res.json({ success: true, message: 'OTP generated (email not configured)', otp });
    }
    
    // Send OTP via email
    await sendOTPEmail(email, otp, 'reset');
    
    console.log(`[SEND RESET OTP] OTP sent to ${email}: ${otp}`);
    res.json({ success: true, message: 'OTP sent to your email', otp }); // Remove otp in production
  } catch (err) {
    console.error('[SEND RESET OTP] Server error:', err);
    res.status(500).json({ error: 'Server error', details: err && err.message ? err.message : err });
  }
});

// POST /auth/generate-otp - Generate OTP for email verification
router.post('/generate-otp', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('[GENERATE OTP] Email not configured - using dev mode');
      
      // Generate OTP for dev mode
      const otp = generateOTP();
      
      // Store OTP in global store with 5 minutes expiry
      if (!global.otpVerificationStore) {
        global.otpVerificationStore = {};
      }
      
      global.otpVerificationStore[email] = {
        otp,
        expires: Date.now() + 5 * 60 * 1000 // 5 minutes
      };

      console.log(`[GENERATE OTP] DEV MODE - OTP for ${email}: ${otp}`);
      
      return res.json({ 
        message: 'OTP generated (email not configured)',
        otp // In dev mode, return OTP directly
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP in global store with 5 minutes expiry
    if (!global.otpVerificationStore) {
      global.otpVerificationStore = {};
    }
    
    global.otpVerificationStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    };

    // Send OTP via email
    await sendOTPEmail(email, otp, 'verification');

    console.log(`[GENERATE OTP] OTP sent to ${email}: ${otp}`);
    
    // For development, return OTP in response (remove in production)
    res.json({ 
      message: 'OTP sent to your email',
      otp // Remove this in production
    });
  } catch (err) {
    console.error('[GENERATE OTP] Error:', err);
    res.status(500).json({ error: 'Failed to send OTP email' });
  }
});

// POST /auth/verify-otp - Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {
    if (!global.otpVerificationStore || !global.otpVerificationStore[email]) {
      return res.status(400).json({ error: 'OTP not found or expired' });
    }

    const otpRecord = global.otpVerificationStore[email];
    
    if (Date.now() > otpRecord.expires) {
      delete global.otpVerificationStore[email];
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP is valid, remove it
    delete global.otpVerificationStore[email];
    
    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('[VERIFY OTP] Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /auth/register
router.post('/register', register);

// POST /auth/login
// POST /auth/login - Use controller for proper role handling
router.post('/login', login);

// POST /auth/forgot-password - Simple password reset with phone verification
router.post('/forgot-password', async (req, res) => {
  const { phone, newPassword } = req.body;
  
  if (!phone || !newPassword) {
    return res.status(400).json({ error: 'Phone number and new password are required' });
  }

  try {
    const bcrypt = (await import('bcryptjs')).default;
    const user = await User.findOne({ where: { PhoneNumber: phone } });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.Password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

export default router;
