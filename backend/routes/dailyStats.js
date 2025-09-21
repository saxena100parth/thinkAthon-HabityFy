const express = require('express');
const router = express.Router();
const {
    getDailyStats,
    getTodayStats,
    updateTodayStats,
    getStreakData,
    getCategoryPerformance
} = require('../controllers/dailyStatsController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Daily stats routes
router.get('/', getDailyStats);
router.get('/today', getTodayStats);
router.put('/today', updateTodayStats);
router.get('/streak', getStreakData);
router.get('/category-performance', getCategoryPerformance);

module.exports = router;
