const dataService = require('../services/dataService');

// @desc    Get dashboard analytics & Campus Pulse metrics
// @route   GET /api/dashboard/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await dataService.getDashboardStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error compiling dashboard statistics', error: err.message });
  }
};

// @desc    Reset / reseed database with fresh exhibition data
// @route   POST /api/seed/reset
exports.resetSeedData = async (req, res) => {
  try {
    const result = await dataService.resetAllData();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reset seed data', error: err.message });
  }
};

