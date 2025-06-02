const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ADMIN_EMAIL = 'admin@yourapp.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_NAME = 'Admin';

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({status: 200, message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hardcoded admin login
    if ((email === ADMIN_EMAIL || name === ADMIN_NAME) && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ id: 'admin_id', role: 'admin' }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      return res.status(200).json({
        status: 200,
        message: 'Login successful',
        role: 'ADMIN',
        name: 'Admin',
        token
      });
    }

    // Regular user login
    const user = await User.findOne({ $or: [{ email }, { name }] });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      status: 200,
      message: 'Login successful',
      role: user.role.toUpperCase(), // USER
      name: user.name,
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
