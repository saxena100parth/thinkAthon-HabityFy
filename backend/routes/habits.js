const express = require('express');
const router = express.Router();
const {
    getHabits,
    getHabit,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    getHabitStats
} = require('../controllers/habitController');
const { validate, schemas } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Habit routes
router.get('/', getHabits);
router.get('/stats', getHabitStats);
router.get('/:id', getHabit);
router.post('/', validate(schemas.createHabit), createHabit);
router.put('/:id', validate(schemas.updateHabit), updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/toggle', toggleHabit);

module.exports = router;
