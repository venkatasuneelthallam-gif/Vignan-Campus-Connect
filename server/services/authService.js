const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getDbStatus } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'vignan_campusconnect_secret_key_2026';

// In-Memory store fallback
let memoryUsers = [];

const DEFAULT_USERS = [
  {
    name: 'Pavan Kumar Reddy',
    email: '221fa04108@vignan.ac.in',
    password: 'vignan123',
    role: 'student',
    studentId: '221FA04108',
    department: 'Computer Science & Engineering (CSE)',
    campus: 'VFSTR Vadlamudi, Guntur',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  },
  {
    name: 'Dr. K. V. Krishna Kishore',
    email: 'dean.affairs@vignan.ac.in',
    password: 'dean123',
    role: 'admin',
    studentId: 'VIG-STAFF-DEAN',
    department: 'VFSTR Administration & Estate Operations',
    campus: 'VFSTR Vadlamudi, Guntur',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
  }
];

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function sanitizeUser(user) {
  return {
    id: user._id ? user._id.toString() : user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    studentId: user.studentId || '',
    department: user.department || 'Computer Science & Engineering (CSE)',
    campus: user.campus || 'VFSTR Vadlamudi, Guntur',
    avatar: user.avatar || '',
    createdAt: user.createdAt
  };
}

// Seed default users if empty
const initUsers = async () => {
  const dbStatus = getDbStatus();

  if (dbStatus.connected) {
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        for (const u of DEFAULT_USERS) {
          const newUser = new User(u);
          await newUser.save();
        }
        console.log('[Seed] Populated MongoDB with default Vignan users (Student & Dean).');
      }
    } catch (err) {
      console.error('[User Seed Error]', err);
    }
  } else {
    // Populate in-memory users
    memoryUsers = [];
    for (const u of DEFAULT_USERS) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      memoryUsers.push({
        id: 'usr-' + Math.random().toString(36).substr(2, 9),
        ...u,
        password: hashedPassword,
        createdAt: new Date()
      });
    }
    console.log('[Seed] Initialized In-Memory store with default demo users.');
  }
};

// Register a new user
const registerUser = async ({ name, email, password, role, studentId, department, campus }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const dbStatus = getDbStatus();

  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const assignedRole = role === 'admin' ? 'admin' : 'student';

  if (dbStatus.connected) {
    // Check if user already exists in MongoDB
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: assignedRole,
      studentId: studentId ? studentId.trim() : '',
      department: department ? department.trim() : 'Computer Science & Engineering (CSE)',
      campus: campus ? campus.trim() : 'VFSTR Vadlamudi, Guntur',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}`
    });

    await user.save();
    const token = generateToken(user);
    return { user: sanitizeUser(user), token };
  }

  // Fallback in-memory
  const existingMemory = memoryUsers.find(u => u.email === normalizedEmail);
  if (existingMemory) {
    throw new Error('An account with this email already exists.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newMemUser = {
    id: 'usr-' + Date.now(),
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: assignedRole,
    studentId: studentId ? studentId.trim() : '',
    department: department ? department.trim() : 'Computer Science & Engineering (CSE)',
    campus: campus ? campus.trim() : 'VFSTR Vadlamudi, Guntur',
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}`,
    createdAt: new Date()
  };

  memoryUsers.push(newMemUser);
  const token = generateToken(newMemUser);
  return { user: sanitizeUser(newMemUser), token };
};

// Authenticate / Login user
const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Please provide email and password.');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const dbStatus = getDbStatus();

  if (dbStatus.connected) {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = generateToken(user);
    return { user: sanitizeUser(user), token };
  }

  // Fallback in-memory
  const memUser = memoryUsers.find(u => u.email === normalizedEmail);
  if (!memUser) {
    throw new Error('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, memUser.password);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  const token = generateToken(memUser);
  return { user: sanitizeUser(memUser), token };
};

// Get user profile by ID
const getUserById = async (id) => {
  const dbStatus = getDbStatus();

  if (dbStatus.connected && mongoose.Types.ObjectId.isValid(id)) {
    const user = await User.findById(id).select('-password');
    if (user) return sanitizeUser(user);
  }

  const memUser = memoryUsers.find(u => u.id === id || (u._id && u._id.toString() === id));
  if (memUser) return sanitizeUser(memUser);

  return null;
};

module.exports = {
  initUsers,
  registerUser,
  loginUser,
  getUserById,
  DEFAULT_USERS
};

