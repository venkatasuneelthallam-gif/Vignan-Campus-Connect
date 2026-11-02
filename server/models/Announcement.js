const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an announcement title'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  message: {
    type: String,
    required: [true, 'Please provide the announcement message content'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Academic', 'Events', 'Maintenance', 'Urgent Alert', 'General'],
    default: 'General'
  },
  priority: {
    type: String,
    enum: ['Normal', 'Important', 'Critical'],
    default: 'Normal'
  },
  postedBy: {
    type: String,
    default: 'Vignan University Administration (VFSTR)'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);

