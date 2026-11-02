const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const LostItem = require('../models/LostItem');
const Announcement = require('../models/Announcement');
const { seedComplaints, seedLostItems, seedAnnouncements } = require('../data/seedData');
const { getDbStatus } = require('../config/db');

// In-Memory store fallback for live university exhibition resilience
let memoryComplaints = [];
let memoryLostItems = [];
let memoryAnnouncements = [];

function generateId() {
  return new mongoose.Types.ObjectId().toString();
}

// Initialize seed data
const initData = async () => {
  const status = getDbStatus();

  if (status.connected) {
    try {
      const complaintCount = await Complaint.countDocuments();
      if (complaintCount === 0) {
        await Complaint.insertMany(seedComplaints);
        console.log('[Seed] Populated MongoDB with default complaints.');
      }

      const lostCount = await LostItem.countDocuments();
      if (lostCount === 0) {
        await LostItem.insertMany(seedLostItems);
        console.log('[Seed] Populated MongoDB with default lost & found items.');
      }

      const announcementCount = await Announcement.countDocuments();
      if (announcementCount === 0) {
        await Announcement.insertMany(seedAnnouncements);
        console.log('[Seed] Populated MongoDB with default announcements.');
      }
    } catch (err) {
      console.error('[Seed Error]', err);
    }
  } else {
    // Populate in-memory store
    reseedMemoryStore();
  }
};

const reseedMemoryStore = () => {
  memoryComplaints = seedComplaints.map(item => ({
    _id: generateId(),
    ...item,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.createdAt)
  }));

  memoryLostItems = seedLostItems.map(item => ({
    _id: generateId(),
    ...item,
    date: new Date(item.date),
    createdAt: new Date(item.createdAt)
  }));

  memoryAnnouncements = seedAnnouncements.map(item => ({
    _id: generateId(),
    ...item,
    createdAt: new Date(item.createdAt)
  }));

  console.log('[Seed] Initialized In-Memory CampusConnect data store with full realistic exhibition dataset.');
};

// ----------------- COMPLAINTS -----------------
const getComplaints = async ({ search, category, status, sortBy = 'newest' }) => {
  const dbStatus = getDbStatus();

  if (dbStatus.connected) {
    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { description: regex }, { location: regex }, { studentName: regex }];
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'oldest') sortOption = { createdAt: 1 };
    if (sortBy === 'priority') sortOption = { priority: -1, createdAt: -1 };

    return await Complaint.find(query).sort(sortOption);
  }

  // Fallback
  let items = [...memoryComplaints];

  if (category && category !== 'All') {
    items = items.filter(c => c.category === category);
  }
  if (status && status !== 'All') {
    items = items.filter(c => c.status === status);
  }
  if (search && search.trim()) {
    const s = search.toLowerCase();
    items = items.filter(c =>
      c.title.toLowerCase().includes(s) ||
      c.description.toLowerCase().includes(s) ||
      c.location.toLowerCase().includes(s) ||
      (c.studentName && c.studentName.toLowerCase().includes(s))
    );
  }

  items.sort((a, b) => {
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return items;
};

const getComplaintById = async (id) => {
  const dbStatus = getDbStatus();
  if (dbStatus.connected) {
    return await Complaint.findById(id);
  }
  return memoryComplaints.find(c => c._id.toString() === id.toString()) || null;
};

const createComplaint = async (data) => {
  const dbStatus = getDbStatus();

  const allowedCategories = [
    'Electrical',
    'Cleaning & Washrooms',
    'Classroom & Furniture',
    'IT & AV Equipment',
    'Hostel & Mess',
    'Campus Infrastructure',
    'Other'
  ];
  const safeCategory = allowedCategories.includes(data.category) ? data.category : 'Other';
  const safePriority = ['Low', 'Medium', 'High', 'Urgent'].includes(data.priority) ? data.priority : 'Medium';

  const cleanData = {
    ...data,
    category: safeCategory,
    priority: safePriority,
    status: data.status || 'Pending',
    studentName: data.studentName || 'Pavan Kumar Reddy',
    studentEmail: data.studentEmail || '221fa04108@vignan.ac.in',
    adminNotes: data.adminNotes || ''
  };

  if (dbStatus.connected) {
    try {
      const complaint = new Complaint(cleanData);
      return await complaint.save();
    } catch (dbErr) {
      console.warn('[Database] Mongoose save error, falling back to local memory store:', dbErr.message);
    }
  }

  const newDoc = {
    _id: generateId(),
    ...cleanData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  memoryComplaints.unshift(newDoc);
  return newDoc;
};

const updateComplaint = async (id, updateFields) => {
  const dbStatus = getDbStatus();
  if (dbStatus.connected) {
    return await Complaint.findByIdAndUpdate(
      id,
      { ...updateFields, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
  }

  const index = memoryComplaints.findIndex(c => c._id.toString() === id.toString());
  if (index === -1) return null;

  memoryComplaints[index] = {
    ...memoryComplaints[index],
    ...updateFields,
    updatedAt: new Date()
  };
  return memoryComplaints[index];
};

const deleteComplaint = async (id) => {
  const dbStatus = getDbStatus();
  if (dbStatus.connected) {
    return await Complaint.findByIdAndDelete(id);
  }

  const index = memoryComplaints.findIndex(c => c._id.toString() === id.toString());
  if (index === -1) return null;
  const removed = memoryComplaints.splice(index, 1)[0];
  return removed;
};

// ----------------- LOST AND FOUND -----------------
const getLostItems = async ({ search, type, category, status }) => {
  const dbStatus = getDbStatus();
  if (dbStatus.connected) {
    const query = {};
    if (type && type !== 'All') query.type = type;
    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ itemName: regex }, { description: regex }, { location: regex }, { postedBy: regex }];
    }
    return await LostItem.find(query).sort({ createdAt: -1 });
  }

  let items = [...memoryLostItems];
  if (type && type !== 'All') items = items.filter(item => item.type === type);
  if (category && category !== 'All') items = items.filter(item => item.category === category);
  if (status && status !== 'All') items = items.filter(item => item.status === status);
  if (search && search.trim()) {
    const s = search.toLowerCase();
    items = items.filter(item =>
      item.itemName.toLowerCase().includes(s) ||
      item.description.toLowerCase().includes(s) ||
      item.location.toLowerCase().includes(s) ||
      (item.postedBy && item.postedBy.toLowerCase().includes(s))
    );
  }

  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return items;
};

const createLostItem = async (data) => {
  const dbStatus = getDbStatus();
  if (dbStatus.connected) {
    const item = new LostItem(data);
    return await item.save();
  }

  const newDoc = {
    _id: generateId(),
    itemName: data.itemName,
    type: data.type || 'Lost',
    category: data.category || 'Other',
    location: data.location,
    date: data.date ? new Date(data.date) : new Date(),
    description: data.description,
    contact: data.contact,
    postedBy: data.postedBy || 'Vignan Campus Member',
    status: data.status || 'Active',
    createdAt: new Date()
  };
  memoryLostItems.unshift(newDoc);
  return newDoc;
};

const updateLostItem = async (id, updateFields) => {
  const dbStatus = getDbStatus();
  if (dbStatus.connected) {
    return await LostItem.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
  }

  const index = memoryLostItems.findIndex(i => i._id.toString() === id.toString());
  if (index === -1) return null;
  memoryLostItems[index] = { ...memoryLostItems[index], ...updateFields };
  return memoryLostItems[index];
};

const deleteLostItem = async (id) => {
  const dbStatus = getDbStatus();
  if (dbStatus.connected) {
    return await LostItem.findByIdAndDelete(id);
  }

  const index = memoryLostItems.findIndex(i => i._id.toString() === id.toString());
  if (index === -1) return null;
  return memoryLostItems.splice(index, 1)[0];
};

// ----------------- ANNOUNCEMENTS -----------------
const getAnnouncements = async () => {
  const dbStatus = getDbStatus();
  if (dbStatus.connected) {
    return await Announcement.find().sort({ createdAt: -1 });
  }
  return [...memoryAnnouncements].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const createAnnouncement = async (data) => {
  const dbStatus = getDbStatus();
  if (dbStatus.connected) {
    const announcement = new Announcement(data);
    return await announcement.save();
  }

  const newDoc = {
    _id: generateId(),
    title: data.title,
    message: data.message,
    category: data.category || 'General',
    priority: data.priority || 'Normal',
    postedBy: data.postedBy || 'Vignan University Administration',
    createdAt: new Date()
  };
  memoryAnnouncements.unshift(newDoc);
  return newDoc;
};

const deleteAnnouncement = async (id) => {
  const dbStatus = getDbStatus();
  if (dbStatus.connected) {
    return await Announcement.findByIdAndDelete(id);
  }

  const index = memoryAnnouncements.findIndex(a => a._id.toString() === id.toString());
  if (index === -1) return null;
  return memoryAnnouncements.splice(index, 1)[0];
};

// ----------------- CAMPUS PULSE & DASHBOARD STATS -----------------
const getDashboardStats = async () => {
  const dbStatus = getDbStatus();
  let complaints = [];
  let lostItems = [];

  if (dbStatus.connected) {
    complaints = await Complaint.find();
    lostItems = await LostItem.find();
  } else {
    complaints = memoryComplaints;
    lostItems = memoryLostItems;
  }

  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;

  const resolutionRate = totalComplaints > 0
    ? Math.round((resolvedComplaints / totalComplaints) * 100)
    : 0;

  // Category breakdown for Campus Pulse
  const categoryCounts = {};
  const categoryResolved = {};

  complaints.forEach(c => {
    const cat = c.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    if (c.status === 'Resolved') {
      categoryResolved[cat] = (categoryResolved[cat] || 0) + 1;
    }
  });

  const categoryBreakdown = Object.keys(categoryCounts).map(cat => ({
    category: cat,
    total: categoryCounts[cat],
    resolved: categoryResolved[cat] || 0,
    percentage: Math.round((categoryCounts[cat] / totalComplaints) * 100)
  })).sort((a, b) => b.total - a.total);

  const topCategories = categoryBreakdown.slice(0, 4);

  // Lost and found breakdown
  const totalLostItems = lostItems.length;
  const activeLostItems = lostItems.filter(i => i.status === 'Active').length;
  const claimedLostItems = lostItems.filter(i => i.status === 'Claimed').length;
  const lostCount = lostItems.filter(i => i.type === 'Lost').length;
  const foundCount = lostItems.filter(i => i.type === 'Found').length;

  // Recent activity feed
  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(c => ({
      id: c._id,
      title: c.title,
      type: 'complaint',
      status: c.status,
      category: c.category,
      studentName: c.studentName,
      location: c.location,
      createdAt: c.createdAt
    }));

  return {
    databaseMode: dbStatus.mode,
    totalComplaints,
    pendingComplaints,
    inProgressComplaints,
    resolvedComplaints,
    resolutionRate,
    categoryBreakdown,
    topCategories,
    lostAndFoundStats: {
      total: totalLostItems,
      active: activeLostItems,
      claimed: claimedLostItems,
      lost: lostCount,
      found: foundCount
    },
    recentComplaints
  };
};

// Reset / Reseed data
const resetAllData = async () => {
  const dbStatus = getDbStatus();
  if (dbStatus.connected) {
    await Complaint.deleteMany({});
    await LostItem.deleteMany({});
    await Announcement.deleteMany({});

    await Complaint.insertMany(seedComplaints);
    await LostItem.insertMany(seedLostItems);
    await Announcement.insertMany(seedAnnouncements);
  } else {
    reseedMemoryStore();
  }
  return { success: true, message: 'CampusConnect database successfully restored to fresh demo state.' };
};

module.exports = {
  initData,
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint,
  getLostItems,
  createLostItem,
  updateLostItem,
  deleteLostItem,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getDashboardStats,
  resetAllData
};

