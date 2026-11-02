const dataService = require('../services/dataService');

// @desc    Get all campus announcements
// @route   GET /api/announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await dataService.getAnnouncements();
    res.json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error retrieving announcements', error: err.message });
  }
};

// @desc    Create an announcement (Admin)
// @route   POST /api/announcements
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, category, priority, postedBy } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and message for the announcement.'
      });
    }

    const announcement = await dataService.createAnnouncement({
      title,
      message,
      category: category || 'General',
      priority: priority || 'Normal',
      postedBy: postedBy || 'Campus Administration'
    });

    res.status(201).json({
      success: true,
      message: 'Campus announcement published successfully!',
      data: announcement
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Validation error', error: err.message });
  }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
exports.deleteAnnouncement = async (req, res) => {
  try {
    const deleted = await dataService.deleteAnnouncement(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.json({ success: true, message: 'Announcement removed', data: deleted });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete announcement', error: err.message });
  }
};

