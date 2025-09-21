const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Habit = require('../models/Habit');
const Notification = require('../models/Notification');

// Load environment variables
dotenv.config();

// Sample data
const sampleUsers = [
    {
        email: 'john@example.com',
        username: 'john_doe',
        mobile: '+1234567890',
        passwordHash: '$2a$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV',
        isPasswordSet: true,
        isEmailVerified: true,
        isMobileVerified: true
    },
    {
        email: 'jane@example.com',
        username: 'jane_smith',
        mobile: '+1987654321',
        passwordHash: '$2a$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV',
        isPasswordSet: true,
        isEmailVerified: true,
        isMobileVerified: true
    }
];

const sampleHabits = [
    {
        title: 'Morning Exercise',
        description: '30 minutes of cardio and strength training',
        frequency: 'daily',
        timeOfDay: '07:00',
        reminderEnabled: true,
        isActive: true,
        history: [
            { date: '2024-01-15', completed: true, completedAt: new Date('2024-01-15T07:30:00Z') },
            { date: '2024-01-16', completed: true, completedAt: new Date('2024-01-16T07:25:00Z') },
            { date: '2024-01-17', completed: false },
            { date: '2024-01-18', completed: true, completedAt: new Date('2024-01-18T07:35:00Z') },
            { date: '2024-01-19', completed: true, completedAt: new Date('2024-01-19T07:20:00Z') }
        ],
        currentStreak: 2,
        maxStreak: 5
    },
    {
        title: 'Read Books',
        description: 'Read at least 20 pages daily',
        frequency: 'daily',
        timeOfDay: '20:00',
        reminderEnabled: true,
        isActive: true,
        history: [
            { date: '2024-01-15', completed: true, completedAt: new Date('2024-01-15T20:15:00Z') },
            { date: '2024-01-16', completed: true, completedAt: new Date('2024-01-16T20:30:00Z') },
            { date: '2024-01-17', completed: true, completedAt: new Date('2024-01-17T20:45:00Z') },
            { date: '2024-01-18', completed: true, completedAt: new Date('2024-01-18T20:20:00Z') },
            { date: '2024-01-19', completed: false }
        ],
        currentStreak: 0,
        maxStreak: 4
    },
    {
        title: 'Meditation',
        description: '10 minutes of mindfulness meditation',
        frequency: 'daily',
        timeOfDay: '09:00',
        reminderEnabled: true,
        isActive: true,
        history: [
            { date: '2024-01-15', completed: true, completedAt: new Date('2024-01-15T09:10:00Z') },
            { date: '2024-01-16', completed: true, completedAt: new Date('2024-01-16T09:05:00Z') },
            { date: '2024-01-17', completed: true, completedAt: new Date('2024-01-17T09:15:00Z') },
            { date: '2024-01-18', completed: true, completedAt: new Date('2024-01-18T09:00:00Z') },
            { date: '2024-01-19', completed: true, completedAt: new Date('2024-01-19T09:12:00Z') }
        ],
        currentStreak: 5,
        maxStreak: 5
    }
];

const sampleNotifications = [
    {
        message: 'Welcome to HabityFy! Start building great habits today.',
        type: 'general',
        scheduledAt: new Date(),
        read: false
    },
    {
        message: '🎉 Amazing! You\'ve maintained "Morning Exercise" for 5 days straight!',
        type: 'achievement',
        scheduledAt: new Date(),
        read: false
    },
    {
        message: 'Time for "Read Books"!',
        type: 'reminder',
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        read: false
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Habit.deleteMany({});
        await Notification.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create users
        const users = await User.insertMany(sampleUsers);
        console.log(`👥 Created ${users.length} users`);

        // Create habits for first user
        const habits = [];
        for (const habitData of sampleHabits) {
            const habit = await Habit.create({
                ...habitData,
                userId: users[0]._id
            });
            habits.push(habit);
        }
        console.log(`🏃 Created ${habits.length} habits`);

        // Create notifications for first user
        const notifications = [];
        for (const notificationData of sampleNotifications) {
            const notification = await Notification.create({
                ...notificationData,
                userId: users[0]._id,
                habitId: notificationData.type === 'reminder' ? habits[1]._id : null
            });
            notifications.push(notification);
        }
        console.log(`🔔 Created ${notifications.length} notifications`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\nTest credentials:');
        console.log('Email: john@example.com');
        console.log('Username: john_doe');
        console.log('Password: password123');
        console.log('\nEmail: jane@example.com');
        console.log('Username: jane_smith');
        console.log('Password: password123');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('📦 Database connection closed');
        process.exit(0);
    }
}

// Run seed function
seedDatabase();
