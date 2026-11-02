const express = require('express');
const router = express.Router();
const {
  getLostItems,
  createLostItem,
  updateLostItemStatus,
  deleteLostItem
} = require('../controllers/lostItemController');

router.route('/')
  .get(getLostItems)
  .post(createLostItem);

router.route('/:id')
  .patch(updateLostItemStatus)
  .delete(deleteLostItem);

module.exports = router;
