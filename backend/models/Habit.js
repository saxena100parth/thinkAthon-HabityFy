const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    masterHabitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MasterHabit',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Habit title is required'],
        trim: true,
        maxlength: [100, 'Habit title cannot exceed 100 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
        type: String,
        required: true,
        enum: [
            'health_fitness',
            'mental_wellbeing',
            'learning_growth',
            'productivity_career',
            'lifestyle_relationships'
        ],
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'custom'],
        default: 'daily',
    },
    timeOfDay: [{
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:mm)'],
    }],
    primaryTime: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:mm)'],
        default: '09:00',
    },
    duration: {
        type: String, // e.g., "20-30 min", "5-10 min", "10 pages"
        default: '15 min',
    },
    customDuration: {
        type: Number, // Custom duration in minutes
        min: 1,
        max: 1440, // Max 24 hours
    },
    targetValue: {
        type: Number, // For habits like "drink 8 glasses" or "walk 10000 steps"
        min: 1,
    },
    unit: {
        type: String, // e.g., "glasses", "steps", "pages", "minutes"
        trim: true,
    },
    reminderEnabled: {
        type: Boolean,
        default: true,
    },
    reminderTimes: [{
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:mm)'],
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [20, 'Tag cannot exceed 20 characters'],
    }],
    history: [{
        date: {
            type: String, // YYYY-MM-DD format
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        completedAt: {
            type: Date,
        },
    }],
    currentStreak: {
        type: Number,
        default: 0,
    },
    maxStreak: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Method to toggle habit completion for today
habitSchema.methods.toggleCompletion = function () {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = this.history.find(entry => entry.date === today);

    if (todayEntry) {
        // Toggle existing entry
        todayEntry.completed = !todayEntry.completed;
        todayEntry.completedAt = todayEntry.completed ? new Date() : null;
    } else {
        // Create new entry
        this.history.push({
            date: today,
            completed: true,
            completedAt: new Date(),
        });
    }

    // Update streaks
    this.updateStreaks();
    return this.save();
};

// Method to get week start date (Monday)
habitSchema.methods.getWeekStart = function (date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
};

// Method to check if habit is completed for the week
habitSchema.methods.isCompletedForWeek = function (date) {
    const weekStart = this.getWeekStart(date);
    const weekEnd = new Date(new Date(weekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return this.history.some(entry => {
        const entryDate = entry.date;
        return entryDate >= weekStart && entryDate <= weekEnd && entry.completed;
    });
};

// Method to toggle weekly habit completion
habitSchema.methods.toggleWeeklyCompletion = function (date) {
    const weekStart = this.getWeekStart(date);
    const weekEnd = new Date(new Date(weekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Check if already completed this week
    const isCompleted = this.isCompletedForWeek(date);

    if (isCompleted) {
        // Remove all completions for this week
        this.history = this.history.filter(entry => {
            const entryDate = entry.date;
            return !(entryDate >= weekStart && entryDate <= weekEnd && entry.completed);
        });
    } else {
        // Add completion for the specified date
        const targetDate = new Date(date).toISOString().split('T')[0];
        const existingEntry = this.history.find(entry => entry.date === targetDate);

        if (existingEntry) {
            existingEntry.completed = true;
            existingEntry.completedAt = new Date();
        } else {
            this.history.push({
                date: targetDate,
                completed: true,
                completedAt: new Date()
            });
        }
    }

    // Update streaks for weekly habits
    this.updateWeeklyStreaks();
    return this.save();
};

// Method to update streaks for weekly habits
habitSchema.methods.updateWeeklyStreaks = function () {
    const sortedHistory = this.history
        .filter(entry => entry.completed)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    // Group completions by week
    const weeklyCompletions = new Map();

    sortedHistory.forEach(entry => {
        const weekStart = this.getWeekStart(entry.date);
        if (!weeklyCompletions.has(weekStart)) {
            weeklyCompletions.set(weekStart, false);
        }
        weeklyCompletions.set(weekStart, true);
    });

    // Calculate streaks based on weekly completions
    const weeks = Array.from(weeklyCompletions.keys()).sort();
    const today = new Date();
    const currentWeekStart = this.getWeekStart(today);

    // Calculate current streak (consecutive weeks from current week backwards)
    let checkWeek = new Date(currentWeekStart);
    for (let i = 0; i < 52; i++) { // Check last 52 weeks
        const weekStartStr = checkWeek.toISOString().split('T')[0];
        if (weeklyCompletions.get(weekStartStr)) {
            currentStreak++;
        } else {
            break;
        }
        checkWeek.setDate(checkWeek.getDate() - 7);
    }

    // Calculate max streak
    tempStreak = 0;
    weeks.forEach(weekStart => {
        if (weeklyCompletions.get(weekStart)) {
            tempStreak++;
            maxStreak = Math.max(maxStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    });

    this.currentStreak = currentStreak;
    this.maxStreak = maxStreak;
};

// Method to update current and max streaks
habitSchema.methods.updateStreaks = function () {
    const sortedHistory = this.history
        .filter(entry => entry.completed)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    let checkDate = new Date(today);

    // Calculate current streak
    for (let i = 0; i < 365; i++) { // Check last 365 days
        const dateStr = checkDate.toISOString().split('T')[0];
        const entry = sortedHistory.find(e => e.date === dateStr);

        if (entry && entry.completed) {
            currentStreak++;
        } else {
            break;
        }

        checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calculate max streak
    for (let i = 0; i < sortedHistory.length; i++) {
        if (i === 0 || this.isConsecutiveDay(sortedHistory[i - 1].date, sortedHistory[i].date)) {
            tempStreak++;
            maxStreak = Math.max(maxStreak, tempStreak);
        } else {
            tempStreak = 1;
        }
    }

    this.currentStreak = currentStreak;
    this.maxStreak = maxStreak;
};

// Helper method to check if two dates are consecutive
habitSchema.methods.isConsecutiveDay = function (date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
};

// Update updatedAt before saving
habitSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;
