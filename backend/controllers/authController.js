import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  return regex.test(password);
};

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, phone } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide fullName, email, password, and confirmPassword' });
    }

    // Validate email
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password
    if (!validatePassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters, contain 1 uppercase letter, 1 number, and 1 special character',
      });
    }

    // Check passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user - role is ALWAYS 'customer' on signup
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      role: 'customer',
    });

    const token = generateToken(user);

    console.log(`New user signup: ${user.email} (${user.fullName})`);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    res.status(500).json({ message: 'Server error during signup' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account deactivated. Contact admin.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    console.log(`User login: ${user.email} (${user.role})`);

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const createVisitAgent = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please provide fullName, email, and password' });
    }

    // Validate email
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password
    if (!validatePassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters, contain 1 uppercase letter, 1 number, and 1 special character',
      });
    }

    // Check existing
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create visit agent - role is ALWAYS 'visitAgent'
    const agent = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      role: 'visitAgent',
      createdBy: req.user.id,
    });

    console.log(`Visit agent created by admin ${req.user.email}: ${agent.email}`);

    res.status(201).json({
      id: agent._id,
      fullName: agent.fullName,
      email: agent.email,
      phone: agent.phone,
      role: agent.role,
      isActive: agent.isActive,
      createdAt: agent.createdAt,
    });
  } catch (error) {
    console.error('Create visit agent error:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    res.status(500).json({ message: 'Server error creating visit agent' });
  }
};
