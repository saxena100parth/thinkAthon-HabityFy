const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        required: false, // Optional - can be general notifications
    },
    message: {
        type: String,
        required: [true, 'Notification message is required'],
        trim: true,
        maxlength: [200, 'Message cannot exceed 200 characters'],
    },
    type: {
        type: String,
        enum: ['reminder', 'achievement', 'motivation', 'general'],
        default: 'general',
    },
    scheduledAt: {
        type: Date,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    readAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Method to mark notification as read
notificationSchema.methods.markAsRead = function () {
    this.read = true;
    this.readAt = new Date();
    return this.save();
};

// Static method to create habit reminder
notificationSchema.statics.createHabitReminder = function (userId, habitId, message, scheduledAt) {
    return this.create({
        userId,
        habitId,
        message,
        type: 'reminder',
        scheduledAt,
    });
};

// Static method to create achievement notification
notificationSchema.statics.createAchievement = function (userId, message, habitId = null) {
    return this.create({
        userId,
        habitId,
        message,
        type: 'achievement',
        scheduledAt: new Date(),
    });
};

// Static method to get unread notifications for user
notificationSchema.statics.getUnreadForUser = function (userId) {
    return this.find({ userId, read: false })
        .populate('habitId', 'title')
        .sort({ createdAt: -1 });
};

// Static method to get all notifications for user
notificationSchema.statics.getForUser = function (userId, limit = 50) {
    return this.find({ userId })
        .populate('habitId', 'title')
        .sort({ createdAt: -1 })
        .limit(limit);
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
