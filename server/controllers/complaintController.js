const dataService = require('../services/dataService');

// @desc    Get all complaints with optional filters
// @route   GET /api/complaints
exports.getComplaints = async (req, res) => {
  try {
    const { search, category, status, sortBy } = req.query;
    const complaints = await dataService.getComplaints({ search, category, status, sortBy });
    return res.json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (err) {
    console.error('[Error] getComplaints:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving complaints', error: err.message });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await dataService.getComplaintById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    return res.json({ success: true, data: complaint });
  } catch (err) {
    console.error('[Error] getComplaintById:', err);
    return res.status(500).json({ success: false, message: 'Error fetching complaint', error: err.message });
  }
};

// @desc    Submit a new complaint
// @route   POST /api/complaints
exports.createComplaint = async (req, res) => {
  try {
    const body = req.body || {};
    const { title, category, location, description, studentName, studentEmail, priority } = body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a complaint title.' });
    }
    if (!location || !location.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide the campus location.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a detailed description of the fault.' });
    }

    const complaint = await dataService.createComplaint({
      title: title.trim(),
      category: (category && category.trim()) || 'Other',
      location: location.trim(),
      description: description.trim(),
      studentName: (studentName && studentName.trim()) || 'Pavan Kumar Reddy',
      studentEmail: (studentEmail && studentEmail.trim()) || '221fa04108@vignan.ac.in',
      priority: priority || 'Medium',
      status: 'Pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully! Our facilities team has been notified.',
      data: complaint
    });
  } catch (err) {
    console.error('[Error] createComplaint:', err);
    return res.status(400).json({ success: false, message: 'Failed to submit complaint: ' + err.message });
  }
};

// @desc    Update complaint status & admin notes
// @route   PATCH /api/complaints/:id
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminNotes, priority } = req.body || {};

    if (status && !['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values: Pending, In Progress, Resolved'
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (priority) updateData.priority = priority;

    const updated = await dataService.updateComplaint(req.params.id, updateData);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    return res.json({
      success: true,
      message: `Complaint updated to status: ${updated.status}`,
      data: updated
    });
  } catch (err) {
    console.error('[Error] updateComplaintStatus:', err);
    return res.status(500).json({ success: false, message: 'Failed to update complaint', error: err.message });
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
exports.deleteComplaint = async (req, res) => {
  try {
    const deleted = await dataService.deleteComplaint(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    return res.json({ success: true, message: 'Complaint deleted successfully', data: deleted });
  } catch (err) {
    console.error('[Error] deleteComplaint:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete complaint', error: err.message });
  }
};
