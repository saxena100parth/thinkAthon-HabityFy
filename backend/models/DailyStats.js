const mongoose = require('mongoose');

const dailyStatsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    date: {
        type: String, // YYYY-MM-DD format
        required: true,
        index: true,
    },
    habitsCompleted: {
        type: Number,
        default: 0,
    },
    totalHabits: {
        type: Number,
        default: 0,
    },
    completionRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    streakDays: {
        type: Number,
        default: 0,
    },
    totalMinutes: {
        type: Number,
        default: 0, // Total time spent on habits
    },
    categoryStats: {
        health_fitness: {
            completed: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
            minutes: { type: Number, default: 0 }
        },
        mental_wellbeing: {
            completed: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
            minutes: { type: Number, default: 0 }
        },
        learning_growth: {
            completed: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
            minutes: { type: Number, default: 0 }
        },
        productivity_career: {
            completed: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
            minutes: { type: Number, default: 0 }
        },
        lifestyle_relationships: {
            completed: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
            minutes: { type: Number, default: 0 }
        }
    },
    mood: {
        type: String,
        enum: ['excellent', 'good', 'okay', 'poor', 'terrible'],
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    achievements: [{
        type: {
            type: String,
            enum: ['streak', 'milestone', 'category_complete', 'perfect_day'],
        },
        message: String,
        value: Number,
        category: String,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound index for efficient queries
dailyStatsSchema.index({ userId: 1, date: 1 }, { unique: true });

// Update updatedAt before saving
dailyStatsSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Method to calculate completion rate
dailyStatsSchema.methods.calculateCompletionRate = function () {
    if (this.totalHabits === 0) {
        this.completionRate = 0;
    } else {
        this.completionRate = Math.round((this.habitsCompleted / this.totalHabits) * 100);
    }
    return this.completionRate;
};

// Method to update category stats
dailyStatsSchema.methods.updateCategoryStats = function (category, completed, total, minutes = 0) {
    if (this.categoryStats[category]) {
        this.categoryStats[category].completed = completed;
        this.categoryStats[category].total = total;
        this.categoryStats[category].minutes = minutes;
    }
};

// Static method to get user's daily stats
dailyStatsSchema.statics.getUserStats = function (userId, startDate, endDate) {
    const query = { userId };

    if (startDate && endDate) {
        query.date = { $gte: startDate, $lte: endDate };
    }

    return this.find(query).sort({ date: -1 });
};

// Static method to get streak data
dailyStatsSchema.statics.getStreakData = function (userId) {
    return this.find({ userId })
        .sort({ date: -1 })
        .limit(365); // Last year
};

// Static method to get category performance
dailyStatsSchema.statics.getCategoryPerformance = function (userId, days = 30) {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return this.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId), date: { $gte: startDate, $lte: endDate } } },
        {
            $group: {
                _id: null,
                health_fitness: { $avg: '$categoryStats.health_fitness.completionRate' },
                mental_wellbeing: { $avg: '$categoryStats.mental_wellbeing.completionRate' },
                learning_growth: { $avg: '$categoryStats.learning_growth.completionRate' },
                productivity_career: { $avg: '$categoryStats.productivity_career.completionRate' },
                lifestyle_relationships: { $avg: '$categoryStats.lifestyle_relationships.completionRate' },
                totalDays: { $sum: 1 },
                avgCompletionRate: { $avg: '$completionRate' }
            }
        }
    ]);
};

const DailyStats = mongoose.model('DailyStats', dailyStatsSchema);

module.exports = DailyStats;
