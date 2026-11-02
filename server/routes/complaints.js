const express = require('express');
const router = express.Router();
const {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint
} = require('../controllers/complaintController');

router.route('/')
  .get(getComplaints)
  .post(createComplaint);

router.route('/:id')
  .get(getComplaintById)
  .patch(updateComplaintStatus)
  .delete(deleteComplaint);

module.exports = router;

