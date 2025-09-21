const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');
const notificationRoutes = require('./routes/notifications');
const masterHabitRoutes = require('./routes/masterHabits');
const dailyStatsRoutes = require('./routes/dailyStats');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/master-habits', masterHabitRoutes);
app.use('/api/daily-stats', dailyStatsRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.json({
        message: 'HabityFy API Server is running!',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            habits: '/api/habits',
            notifications: '/api/notifications',
            masterHabits: '/api/master-habits',
            dailyStats: '/api/daily-stats'
        }
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Schedule daily habit reminders (runs every day at 8 AM)
cron.schedule('0 8 * * *', async () => {
    console.log('🔔 Running daily habit reminders...');

    try {
        const Habit = require('./models/Habit');
        const Notification = require('./models/Notification');

        // Get all active habits with reminders enabled
        const habits = await Habit.find({
            isActive: true,
            reminderEnabled: true
        }).populate('userId', 'email');

        for (const habit of habits) {
            const now = new Date();
            const [hours, minutes] = habit.timeOfDay.split(':');
            const reminderTime = new Date();
            reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            // Check if it's time for this habit's reminder
            if (Math.abs(now - reminderTime) < 60000) { // Within 1 minute
                await Notification.createHabitReminder(
                    habit.userId._id,
                    habit._id,
                    `Time for "${habit.title}"!`,
                    new Date()
                );

                console.log(`📧 Sent reminder for habit: ${habit.title}`);
            }
        }
    } catch (error) {
        console.error('❌ Error in habit reminder cron job:', error);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Allow external connections
app.listen(PORT, HOST, () => {
    console.log(`🚀 HabityFy server is running on ${HOST}:${PORT}`);
    console.log(`📱 API Documentation: http://localhost:${PORT}`);
    console.log(`🌐 Network access: http://${getLocalIP()}:${PORT}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Function to get local IP address
function getLocalIP() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
}