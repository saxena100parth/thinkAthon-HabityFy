const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Create sample notifications
const createSampleNotifications = async () => {
    try {
        // Find a user to create notifications for
        const user = await User.findOne();
        if (!user) {
            console.log('No users found. Please create a user first.');
            return;
        }

        console.log(`Creating sample notifications for user: ${user.username}`);

        // Sample notifications
        const sampleNotifications = [
            {
                userId: user._id,
                message: "🎉 Welcome to HabityFy! Start building great habits today.",
                type: 'general',
                scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                read: false
            },
            {
                userId: user._id,
                message: "💪 Great job! You completed your morning workout habit.",
                type: 'achievement',
                scheduledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                read: false
            },
            {
                userId: user._id,
                message: "⏰ Time for your daily meditation! Don't forget to take a moment for yourself.",
                type: 'reminder',
                scheduledAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
                read: true
            },
            {
                userId: user._id,
                message: "🌟 You're on a 3-day streak! Keep up the amazing work!",
                type: 'achievement',
                scheduledAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
                read: false
            },
            {
                userId: user._id,
                message: "💡 Remember: Small consistent actions lead to big changes. You've got this!",
                type: 'motivation',
                scheduledAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                read: true
            },
            {
                userId: user._id,
                message: "📚 Don't forget to read for 15 minutes today. Knowledge is power!",
                type: 'reminder',
                scheduledAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
                read: false
            }
        ];

        // Clear existing notifications for this user
        await Notification.deleteMany({ userId: user._id });
        console.log('Cleared existing notifications');

        // Create new notifications
        const createdNotifications = await Notification.insertMany(sampleNotifications);
        console.log(`Created ${createdNotifications.length} sample notifications`);

        // Display created notifications
        createdNotifications.forEach((notification, index) => {
            console.log(`${index + 1}. [${notification.type.toUpperCase()}] ${notification.message}`);
        });

    } catch (error) {
        console.error('Error creating sample notifications:', error);
    }
};

// Main function
const main = async () => {
    await connectDB();
    await createSampleNotifications();
    await mongoose.connection.close();
    console.log('Sample notifications created successfully!');
    process.exit(0);
};

// Run the script
main().catch(console.error);
