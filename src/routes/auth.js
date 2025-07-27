

import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
const router = express.Router();

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
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const bcrypt = (await import('bcryptjs')).default;
    const user = await User.findOne({ where: { Email: email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.Password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user.UserID, email: user.Email },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
