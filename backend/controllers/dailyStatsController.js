const DailyStats = require('../models/DailyStats');
const Habit = require('../models/Habit');

// @desc    Get daily stats for user
// @route   GET /api/daily-stats
// @access  Private
const getDailyStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const userId = req.user._id;

        const stats = await DailyStats.getUserStats(userId, startDate, endDate);

        res.json({
            success: true,
            count: stats.length,
            stats
        });
    } catch (error) {
        console.error('Get daily stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching daily stats'
        });
    }
};

// @desc    Get today's stats
// @route   GET /api/daily-stats/today
// @access  Private
const getTodayStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date().toISOString().split('T')[0];

        let todayStats = await DailyStats.findOne({ userId, date: today });

        if (!todayStats) {
            // Create today's stats if they don't exist
            todayStats = await createTodayStats(userId);
        }

        res.json({
            success: true,
            stats: todayStats
        });
    } catch (error) {
        console.error('Get today stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching today\'s stats'
        });
    }
};

// @desc    Update daily stats
// @route   PUT /api/daily-stats/today
// @access  Private
const updateTodayStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date().toISOString().split('T')[0];
        const { mood, notes } = req.body;

        let todayStats = await DailyStats.findOne({ userId, date: today });

        if (!todayStats) {
            todayStats = await createTodayStats(userId);
        }

        // Update mood and notes
        if (mood) todayStats.mood = mood;
        if (notes) todayStats.notes = notes;

        await todayStats.save();

        res.json({
            success: true,
            message: 'Daily stats updated successfully',
            stats: todayStats
        });
    } catch (error) {
        console.error('Update today stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating daily stats'
        });
    }
};

// @desc    Get streak data
// @route   GET /api/daily-stats/streak
// @access  Private
const getStreakData = async (req, res) => {
    try {
        const userId = req.user._id;
        const streakData = await DailyStats.getStreakData(userId);

        // Calculate current streak
        let currentStreak = 0;
        for (const day of streakData) {
            if (day.completionRate >= 80) { // 80% completion rate for streak
                currentStreak++;
            } else {
                break;
            }
        }

        res.json({
            success: true,
            currentStreak,
            streakData: streakData.slice(0, 30) // Last 30 days
        });
    } catch (error) {
        console.error('Get streak data error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching streak data'
        });
    }
};

// @desc    Get category performance
// @route   GET /api/daily-stats/category-performance
// @access  Private
const getCategoryPerformance = async (req, res) => {
    try {
        const userId = req.user._id;
        const { days = 30 } = req.query;

        const performance = await DailyStats.getCategoryPerformance(userId, parseInt(days));

        res.json({
            success: true,
            performance: performance[0] || {
                health_fitness: 0,
                mental_wellbeing: 0,
                learning_growth: 0,
                productivity_career: 0,
                lifestyle_relationships: 0,
                totalDays: 0,
                avgCompletionRate: 0
            }
        });
    } catch (error) {
        console.error('Get category performance error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching category performance'
        });
    }
};

// Helper function to create today's stats
async function createTodayStats(userId) {
    const today = new Date().toISOString().split('T')[0];

    // Get user's active habits
    const habits = await Habit.find({ userId, isActive: true });

    // Calculate completed habits for today
    const completedHabits = habits.filter(habit => {
        const todayEntry = habit.history?.find(entry => entry.date === today);
        return todayEntry?.completed || false;
    });

    // Calculate category stats
    const categoryStats = {
        health_fitness: { completed: 0, total: 0, minutes: 0 },
        mental_wellbeing: { completed: 0, total: 0, minutes: 0 },
        learning_growth: { completed: 0, total: 0, minutes: 0 },
        productivity_career: { completed: 0, total: 0, minutes: 0 },
        lifestyle_relationships: { completed: 0, total: 0, minutes: 0 }
    };

    habits.forEach(habit => {
        const category = habit.category;
        const isCompleted = completedHabits.some(h => h._id.toString() === habit._id.toString());

        if (categoryStats[category]) {
            categoryStats[category].total++;
            if (isCompleted) {
                categoryStats[category].completed++;
            }
        }
    });

    const todayStats = new DailyStats({
        userId,
        date: today,
        habitsCompleted: completedHabits.length,
        totalHabits: habits.length,
        categoryStats
    });

    todayStats.calculateCompletionRate();
    await todayStats.save();

    return todayStats;
}

module.exports = {
    getDailyStats,
    getTodayStats,
    updateTodayStats,
    getStreakData,
    getCategoryPerformance
};
