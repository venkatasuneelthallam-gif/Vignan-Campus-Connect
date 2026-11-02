const mongoose = require('mongoose');

const LostItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Please provide the item name'],
    trim: true,
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Please specify if item is Lost or Found'],
    enum: ['Lost', 'Found'],
    default: 'Lost'
  },
  category: {
    type: String,
    enum: [
      'Electronics',
      'Books & Stationery',
      'ID Cards & Wallets',
      'Keys',
      'Clothing & Accessories',
      'Other'
    ],
    default: 'Other'
  },
  location: {
    type: String,
    required: [true, 'Please provide the campus location where item was lost/found'],
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: [true, 'Please provide a description of the item'],
    trim: true
  },
  contact: {
    type: String,
    required: [true, 'Please provide contact information (phone or email)'],
    trim: true
  },
  postedBy: {
    type: String,
    required: [true, 'Posted by name is required'],
    trim: true,
    default: 'Campus Member'
  },
  status: {
    type: String,
    enum: ['Active', 'Claimed', 'Resolved'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LostItem', LostItemSchema);

