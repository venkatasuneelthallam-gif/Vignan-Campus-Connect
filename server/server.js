require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB, getDbStatus } = require('./config/db');
const { initData } = require('./services/dataService');
const { initUsers } = require('./services/authService');

const complaintsRouter = require('./routes/complaints');
const lostItemsRouter = require('./routes/lostItems');
const announcementsRouter = require('./routes/announcements');
const dashboardRouter = require('./routes/dashboard');
const seedRouter = require('./routes/seed');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/lost-items', lostItemsRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/seed', seedRouter);

// Health check / System info route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'CampusConnect API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: getDbStatus()
  });
});

// Serve frontend static files if client/dist exists (production/single-command demo mode)
const path = require('path');
const fs = require('fs');
const clientDistPath = path.join(__dirname, '../client/dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    // If request does not start with /api, serve index.html
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    } else {
      res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
    }
  });
} else {
  // Root welcome message if dist is not yet built
  app.get('/', (req, res) => {
    res.send('CampusConnect Backend API is active. Access endpoints via /api/* or run Vite frontend.');
  });
  
  // 404 handler for unknown API routes
  app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Startup sequence
const startServer = async () => {
  // Connect to DB (or switch gracefully to Exhibition mode)
  await connectDB();
  // Initialize mock or database seed records
  await initData();
  // Initialize default authentication users (Student & Dean)
  await initUsers();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`===================================================`);
    console.log(`🚀 VignanConnect Server running on port ${PORT}`);
    console.log(`📡 Base API URL: http://localhost:${PORT}/api`);
    console.log(`💾 Data Provider: ${getDbStatus().mode}`);
    console.log(`===================================================`);
  });
};

startServer();
