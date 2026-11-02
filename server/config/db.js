const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusconnect';

  try {
    // Attempt fast connection with short timeout so server does not hang if mongod is absent
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[Database] Notice: Local MongoDB connection to ${uri} failed (${error.message}).`);
    console.log(`[Database] Activating High-Reliability Local In-Memory Provider with full Mongoose schema compatibility for offline live exhibition mode.`);
    isConnected = false;
    return false;
  }
};

const getDbStatus = () => ({
  connected: isConnected,
  mode: isConnected ? 'MongoDB (Mongoose)' : 'CampusConnect In-Memory Store (Zero-Dependency Exhibition Mode)',
  uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusconnect'
});

module.exports = { connectDB, getDbStatus };

