const express = require('express');
const router = express.Router();
const { resetSeedData } = require('../controllers/statsController');

router.post('/reset', resetSeedData);

module.exports = router;

