const express = require('express');
const router = express.Router();
const {
    getMasterHabits,
    getCategories,
    getMasterHabit
} = require('../controllers/masterHabitController');

// Master habits routes (public)
router.get('/', getMasterHabits);
router.get('/categories', getCategories);
router.get('/:id', getMasterHabit);

module.exports = router;
