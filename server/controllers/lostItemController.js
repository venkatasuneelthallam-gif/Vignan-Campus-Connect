const dataService = require('../services/dataService');

// @desc    Get all lost and found listings
// @route   GET /api/lost-items
exports.getLostItems = async (req, res) => {
  try {
    const { search, type, category, status } = req.query;
    const items = await dataService.getLostItems({ search, type, category, status });
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error retrieving lost & found items', error: err.message });
  }
};

// @desc    Create a lost/found listing
// @route   POST /api/lost-items
exports.createLostItem = async (req, res) => {
  try {
    const { itemName, type, category, location, date, description, contact, postedBy } = req.body;

    if (!itemName || !type || !location || !description || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: itemName, type (Lost/Found), location, description, and contact info.'
      });
    }

    const item = await dataService.createLostItem({
      itemName,
      type,
      category: category || 'Other',
      location,
      date: date || new Date(),
      description,
      contact,
      postedBy: postedBy || 'Campus Member',
      status: 'Active'
    });

    res.status(201).json({
      success: true,
      message: `${type} item listing posted successfully!`,
      data: item
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Validation error', error: err.message });
  }
};

// @desc    Update listing status (e.g. Active -> Claimed)
// @route   PATCH /api/lost-items/:id
exports.updateLostItemStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (status && !['Active', 'Claimed', 'Resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values: Active, Claimed, Resolved'
      });
    }

    const updated = await dataService.updateLostItem(req.params.id, { status });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.json({
      success: true,
      message: `Item status updated to ${updated.status}`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update item', error: err.message });
  }
};

// @desc    Delete a listing
// @route   DELETE /api/lost-items/:id
exports.deleteLostItem = async (req, res) => {
  try {
    const deleted = await dataService.deleteLostItem(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    res.json({ success: true, message: 'Listing deleted successfully', data: deleted });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete listing', error: err.message });
  }
};

