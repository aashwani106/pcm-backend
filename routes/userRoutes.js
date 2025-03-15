const express = require('express');
const router = express.Router();
const { getAllStudents } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/students', protect, getAllStudents);

module.exports = router; 