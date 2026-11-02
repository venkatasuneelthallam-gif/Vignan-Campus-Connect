const { registerUser, loginUser, getUserById } = require('../services/authService');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'vignan_campusconnect_secret_key_2026';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, studentId, department, campus } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.'
      });
    }

    const { user, token } = await registerUser({
      name,
      email,
      password,
      role,
      studentId,
      department,
      campus
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully! Welcome to VignanConnect.',
      data: { user, token }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || 'Registration failed. Please check your details.'
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const { user, token } = await loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      data: { user, token }
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message || 'Invalid email or password.'
    });
  }
};

// @desc    Get current user profile from token
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route.'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await getUserById(decoded.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User no longer exists.'
        });
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (tokenErr) {
      return res.status(401).json({
        success: false,
        message: 'Session token invalid or expired. Please sign in again.'
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile.'
    });
  }
};

