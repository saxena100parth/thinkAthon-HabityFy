const mongoose = require('mongoose');

const masterHabitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Habit title is required'],
        trim: true,
        maxlength: [100, 'Habit title cannot exceed 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'health_fitness',
            'mental_wellbeing',
            'learning_growth',
            'productivity_career',
            'lifestyle_relationships'
        ],
    },
    icon: {
        type: String,
        required: true,
    },
    emoji: {
        type: String,
        required: true,
    },
    suggestedFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'custom'],
        default: 'daily',
    },
    suggestedTimeOfDay: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:mm)'],
        default: '09:00',
    },
    suggestedDuration: {
        type: String, // e.g., "20-30 min", "5-10 min", "10 pages"
        default: '15 min',
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
    },
    tags: [{
        type: String,
        trim: true,
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
    sortOrder: {
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

// Update updatedAt before saving
masterHabitSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Static method to get habits by category
masterHabitSchema.statics.getByCategory = function (category) {
    return this.find({ category, isActive: true }).sort({ sortOrder: 1, title: 1 });
};

// Static method to get all categories
masterHabitSchema.statics.getCategories = function () {
    return this.distinct('category', { isActive: true });
};

// Static method to search habits
masterHabitSchema.statics.searchHabits = function (query, category = null) {
    const searchQuery = {
        isActive: true,
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } }
        ]
    };

    if (category) {
        searchQuery.category = category;
    }

    return this.find(searchQuery).sort({ sortOrder: 1, title: 1 });
};

const MasterHabit = mongoose.model('MasterHabit', masterHabitSchema);

module.exports = MasterHabit;
