const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a complaint title'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'Electrical',
      'Cleaning & Washrooms',
      'Classroom & Furniture',
      'IT & AV Equipment',
      'Hostel & Mess',
      'Campus Infrastructure',
      'Other'
    ],
    default: 'Other'
  },
  location: {
    type: String,
    required: [true, 'Please specify the campus location'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a detailed description'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    default: 'Student'
  },
  studentEmail: {
    type: String,
    trim: true,
    default: 'student@vignan.ac.in'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  adminNotes: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on modify
ComplaintSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Complaint', ComplaintSchema);

