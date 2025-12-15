import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In-memory OTP storage (for development - use Redis in production)
const otpStorage = new Map();

// Generate OTP endpoint
export const generateOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 5 minutes expiry
    otpStorage.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    // In production, send OTP via SMS service
    // For now, return OTP in response for development
    console.log(`OTP for ${phone}: ${otp}`);
    
    res.json({ 
      message: 'OTP generated successfully',
      otp // Remove this in production
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify OTP endpoint
export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    const storedData = otpStorage.get(phone);
    
    if (!storedData) {
      return res.status(400).json({ error: 'OTP not found or expired' });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStorage.delete(phone);
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP is valid, remove it
    otpStorage.delete(phone);
    
    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const register = async (req, res) => {
  console.log('\n🚀🚀🚀🚀🚀 REGISTER FUNCTION CALLED - RAW SQL VERSION 🚀🚀🚀🚀🚀\n');
  
  try {
    const { username, email, password, address, name, phone, age, gender } = req.body;
    
    console.log('RAW SQL REGISTRATION - Input received:');
    console.log('  username:', username);
    console.log('  email:', email);
    console.log('  age:', age, 'gender:', gender);
    
    // Check if phone number already exists
    const existingPhone = await User.findOne({ where: { PhoneNumber: phone } });
    if (existingPhone) {
      return res.status(409).json({ 
        error: 'Phone number already exists',
        field: 'phone'
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // RAW SQL INSERT - bypass Sequelize entirely
    const sequelize = (await import('../config/sequelize.js')).default;
    
    const insertQuery = `
      INSERT INTO "Users" ("Username", "Email", "Password", "FirstName", "PhoneNumber", "Address", "Age", "Gender", "Role", "IsActive") 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING "UserID", "Username", "Email", "FirstName", "PhoneNumber", "Address", "Age", "Gender", "Role"
    `;
    
    const values = [
      username || '',
      email || '',
      hashedPassword,
      name || '',
      phone || '',
      address || '',
      age ? parseInt(age) : 0,
      gender || '',
      'user',
      true
    ];
    
    console.log('\n🔧 RAW SQL INSERT EXECUTING...');
    console.log('Query:', insertQuery.trim());
    console.log('Values:', values);
    
    const [result] = await sequelize.query(insertQuery, { bind: values, logging: console.log });
    
    console.log('\n✅ RAW SQL INSERT SUCCESSFUL!');
    console.log('Result:', result[0]);
    
    const user = result[0];

    console.log('\n✅ User created successfully!');
    console.log('  UserID:', user.UserID);
    console.log('  Age in DB:', user.Age);
    console.log('  Gender in DB:', user.Gender);
    console.log('=================================================\n');

    // Find location for user (if provided)
    let location = null;
    if (req.body.locationkey) {
      const Location = (await import('../models/Location.js')).default;
      location = await Location.findOne({ where: { LocationID: req.body.locationkey } });
    }

    // Add to Admins table
    const Admin = (await import('../models/Admin.js')).default;
      await Admin.create({
        userid: user.UserID,
        username: user.Username,
        email: user.Email,
        locationkey: location ? location.LocationID : null,
        photo: req.body.photo || null
    });

    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
     if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Email or username already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    console.log('\n🔐 ============= LOGIN ATTEMPT =============');
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Password provided:', !!password);
    
    if ((!email && !phone) || !password) {
      return res.status(400).json({ error: 'Phone number or email and password are required' });
    }
    let user;
    if (phone) {
      user = await User.findOne({ where: { PhoneNumber: phone } });
    } else if (email) {
      user = await User.findOne({ where: { Email: email } });
    }
    
    console.log('User found:', !!user);
    if (!user) {
      console.log('❌ User not found\n');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.IsActive) {
      console.log('❌ User account is deactivated\n');
      return res.status(403).json({ error: 'Your account has been deactivated. Please contact support.' });
    }
    
    const valid = await bcrypt.compare(password, user.Password);
    console.log('Password valid:', valid);
    if (!valid) {
      console.log('❌ Invalid password\n');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Debug logging - UPDATED
    console.log('\n🔍 =============  USER DATA FROM DATABASE =============');
    console.log('UserID:', user.UserID);
    console.log('Email:', user.Email);
    console.log('Role:', user.Role);
    console.log('Role Type:', typeof user.Role);
    console.log('Role is admin?:', user.Role === 'admin');
    console.log('======================================================\n');
    
    const tokenPayload = { 
      id: user.UserID, 
      email: user.Email, 
      phone: user.PhoneNumber,
      role: user.Role || 'user'
    };
    
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
    
    console.log('\n🎫 ============= JWT TOKEN PAYLOAD =============');
    console.log(JSON.stringify(tokenPayload, null, 2));
    console.log('==============================================\n');
    
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
