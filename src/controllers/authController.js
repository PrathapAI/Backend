import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { username, email, password, address, name, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);
    const user = await User.create({
      Username: username,
      Email: email,
      Password: hashedPassword,
      Address: address,
      FirstName: name,
      PhoneNumber: phone
    });

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
    if ((!email && !phone) || !password) {
      return res.status(400).json({ error: 'Phone number or email and password are required' });
    }
    let user;
    if (phone) {
      user = await User.findOne({ where: { PhoneNumber: phone } });
    } else if (email) {
      user = await User.findOne({ where: { Email: email } });
    }
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.Password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.UserID, email: user.Email, phone: user.PhoneNumber }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
