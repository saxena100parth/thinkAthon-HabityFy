const Habit = require('../models/Habit');
const MasterHabit = require('../models/MasterHabit');
const DailyStats = require('../models/DailyStats');
const Notification = require('../models/Notification');

// @desc    Get all habits for user
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res) => {
    try {
        const { status, sortBy = 'createdAt', sortOrder = 'desc', date } = req.query;
        const userId = req.user._id;

        let query = { userId };

        // Filter by status
        if (status === 'active') {
            query.isActive = true;
        } else if (status === 'inactive') {
            query.isActive = false;
        }

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const habits = await Habit.find(query)
            .populate('masterHabitId', 'title description icon emoji category')
            .sort(sortOptions)
            .select('-__v');

        // If date is provided, add completion status for that specific date
        if (date) {
            const targetDate = new Date(date).toISOString().split('T')[0];
            const habitsWithDateStatus = habits.map(habit => {
                const habitObj = habit.toObject();

                if (habit.frequency === 'weekly') {
                    // For weekly habits, check if completed for the week
                    habitObj.completedForDate = habit.isCompletedForWeek(targetDate);
                    // Find the completion date for this week
                    const weekStart = habit.getWeekStart(targetDate);
                    const weekEnd = new Date(new Date(weekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                    const weekEntry = habit.history.find(entry => {
                        const entryDate = entry.date;
                        return entryDate >= weekStart && entryDate <= weekEnd && entry.completed;
                    });
                    habitObj.completedAtForDate = weekEntry ? weekEntry.completedAt : null;
                    habitObj.isWeeklyCompleted = habitObj.completedForDate;
                } else {
                    // For daily habits, check specific date
                    const dateEntry = habit.history.find(entry => entry.date === targetDate);
                    habitObj.completedForDate = dateEntry ? dateEntry.completed : false;
                    habitObj.completedAtForDate = dateEntry ? dateEntry.completedAt : null;
                }

                return habitObj;
            });

            return res.json({
                success: true,
                count: habitsWithDateStatus.length,
                habits: habitsWithDateStatus,
                targetDate
            });
        }

        res.json({
            success: true,
            count: habits.length,
            habits
        });
    } catch (error) {
        console.error('Get habits error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching habits'
        });
    }
};

// @desc    Get single habit
// @route   GET /api/habits/:id
// @access  Private
const getHabit = async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!habit) {
            return res.status(404).json({
                success: false,
                message: 'Habit not found'
            });
        }

        res.json({
            success: true,
            habit
        });
    } catch (error) {
        console.error('Get habit error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching habit'
        });
    }
};

// @desc    Create new habit from master habit
// @route   POST /api/habits
// @access  Private
const createHabit = async (req, res) => {
    try {
        const {
            masterHabitId,
            title,
            description,
            frequency,
            timeOfDay,
            primaryTime,
            duration,
            customDuration,
            targetValue,
            unit,
            reminderEnabled,
            reminderTimes,
            priority,
            tags
        } = req.body;
        const userId = req.user._id;

        // Get master habit details
        const masterHabit = await MasterHabit.findById(masterHabitId);
        if (!masterHabit) {
            return res.status(404).json({
                success: false,
                message: 'Master habit not found'
            });
        }

        // Check if user already has this habit
        const existingHabit = await Habit.findOne({ userId, masterHabitId });
        if (existingHabit) {
            return res.status(400).json({
                success: false,
                message: 'You already have this habit'
            });
        }

        // Prepare timeOfDay array
        let timeOfDayArray = [];
        if (timeOfDay && Array.isArray(timeOfDay)) {
            timeOfDayArray = timeOfDay;
        } else if (timeOfDay) {
            timeOfDayArray = [timeOfDay];
        } else if (primaryTime) {
            timeOfDayArray = [primaryTime];
        } else {
            timeOfDayArray = [masterHabit.suggestedTimeOfDay];
        }

        // Prepare reminder times
        let reminderTimesArray = [];
        if (reminderTimes && Array.isArray(reminderTimes)) {
            reminderTimesArray = reminderTimes;
        } else if (reminderTimes) {
            reminderTimesArray = [reminderTimes];
        } else if (reminderEnabled) {
            reminderTimesArray = timeOfDayArray;
        }

        const habitData = {
            userId,
            masterHabitId,
            title: title || masterHabit.title,
            description: description || masterHabit.description,
            category: masterHabit.category,
            frequency: frequency || masterHabit.suggestedFrequency,
            timeOfDay: timeOfDayArray,
            primaryTime: primaryTime || timeOfDayArray[0] || masterHabit.suggestedTimeOfDay,
            duration: duration || masterHabit.suggestedDuration,
            customDuration: customDuration,
            targetValue: targetValue,
            unit: unit,
            reminderEnabled: reminderEnabled !== undefined ? reminderEnabled : true,
            reminderTimes: reminderTimesArray,
            priority: priority || 'medium',
            tags: tags || []
        };

        const habit = await Habit.create(habitData);

        // Create initial notification if reminder is enabled
        if (habit.reminderEnabled && habit.reminderTimes && habit.reminderTimes.length > 0) {
            const reminderTime = new Date();
            const [hours, minutes] = habit.reminderTimes[0].split(':');
            reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            // If time has passed today, schedule for tomorrow
            if (reminderTime < new Date()) {
                reminderTime.setDate(reminderTime.getDate() + 1);
            }

            await Notification.createHabitReminder(
                req.user._id,
                habit._id,
                `Time for "${habit.title}"!`,
                reminderTime
            );
        }

        res.status(201).json({
            success: true,
            message: 'Habit created successfully',
            habit
        });
    } catch (error) {
        console.error('Create habit error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating habit'
        });
    }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!habit) {
            return res.status(404).json({
                success: false,
                message: 'Habit not found'
            });
        }

        // Update habit
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                habit[key] = req.body[key];
            }
        });

        await habit.save();

        res.json({
            success: true,
            message: 'Habit updated successfully',
            habit
        });
    } catch (error) {
        console.error('Update habit error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating habit'
        });
    }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res) => {
    try {
        const habit = await Habit.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!habit) {
            return res.status(404).json({
                success: false,
                message: 'Habit not found'
            });
        }

        // Delete related notifications
        await Notification.deleteMany({ habitId: habit._id });

        res.json({
            success: true,
            message: 'Habit deleted successfully'
        });
    } catch (error) {
        console.error('Delete habit error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting habit'
        });
    }
};

// @desc    Toggle habit completion for today
// @route   POST /api/habits/:id/toggle
// @access  Private
const toggleHabit = async (req, res) => {
    try {
        const { date } = req.body;

        // Use provided date or default to today
        const targetDate = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!habit) {
            return res.status(404).json({
                success: false,
                message: 'Habit not found'
            });
        }

        // Handle different frequency types
        if (habit.frequency === 'weekly') {
            // For weekly habits, use weekly completion logic
            await habit.toggleWeeklyCompletion(targetDate);
        } else {
            // For daily habits, use regular completion logic
            let dateEntry = habit.history.find(entry => entry.date === targetDate);

            if (dateEntry) {
                // Toggle existing entry
                dateEntry.completed = !dateEntry.completed;
                dateEntry.completedAt = dateEntry.completed ? new Date() : null;
            } else {
                // Create new entry for the target date
                habit.history.push({
                    date: targetDate,
                    completed: true,
                    completedAt: new Date()
                });
            }

            // Update streaks
            habit.updateStreaks();
            await habit.save();
        }

        // Create completion notification
        const isCompleted = habit.frequency === 'weekly' ?
            habit.isCompletedForWeek(targetDate) :
            habit.history.find(entry => entry.date === targetDate)?.completed;

        if (isCompleted) {
            await Notification.createAchievement(
                req.user._id,
                `✅ Great job! You completed "${habit.title}"!`,
                habit._id
            );
        }

        // Check for achievements
        if (habit.currentStreak > 0 && habit.currentStreak % 7 === 0) {
            await Notification.createAchievement(
                req.user._id,
                `🎉 Amazing! You've maintained "${habit.title}" for ${habit.currentStreak} days straight!`,
                habit._id
            );
        }

        // Get completion status for the response
        let completedForDate, completedAtForDate;

        if (habit.frequency === 'weekly') {
            completedForDate = habit.isCompletedForWeek(targetDate);
            // Find the completion date for this week
            const weekStart = habit.getWeekStart(targetDate);
            const weekEnd = new Date(new Date(weekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const weekEntry = habit.history.find(entry => {
                const entryDate = entry.date;
                return entryDate >= weekStart && entryDate <= weekEnd && entry.completed;
            });
            completedAtForDate = weekEntry ? weekEntry.completedAt : null;
        } else {
            const dateEntry = habit.history.find(entry => entry.date === targetDate);
            completedForDate = dateEntry ? dateEntry.completed : true;
            completedAtForDate = dateEntry ? dateEntry.completedAt : new Date();
        }

        res.json({
            success: true,
            message: `Habit ${completedForDate ? 'completed' : 'uncompleted'} for ${targetDate}`,
            habit: {
                id: habit._id,
                title: habit.title,
                frequency: habit.frequency,
                currentStreak: habit.currentStreak,
                maxStreak: habit.maxStreak,
                completedForDate,
                completedAtForDate,
                targetDate,
                isWeeklyCompleted: habit.frequency === 'weekly' ? completedForDate : undefined
            }
        });
    } catch (error) {
        console.error('Toggle habit error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating habit status'
        });
    }
};

// @desc    Get habit statistics
// @route   GET /api/habits/stats
// @access  Private
const getHabitStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const habits = await Habit.find({ userId, isActive: true });

        const stats = {
            totalHabits: habits.length,
            activeHabits: habits.filter(h => h.isActive).length,
            totalStreak: habits.reduce((sum, h) => sum + h.currentStreak, 0),
            maxStreak: Math.max(...habits.map(h => h.maxStreak), 0),
            todayCompleted: habits.filter(h => {
                const today = new Date().toISOString().split('T')[0];
                return h.history.find(entry => entry.date === today)?.completed;
            }).length,
            completionRate: habits.length > 0 ?
                (habits.filter(h => {
                    const today = new Date().toISOString().split('T')[0];
                    return h.history.find(entry => entry.date === today)?.completed;
                }).length / habits.length * 100).toFixed(1) : 0
        };

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Get habit stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching habit statistics'
        });
    }
};

module.exports = {
    getHabits,
    getHabit,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    getHabitStats
};
