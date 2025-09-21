#!/usr/bin/env node

/**
 * HabityFy Habit Completion Test Script
 * 
 * This script helps you test the daily habit completion functionality
 * Run with: node test-habit-completion.js
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'testpassword123';

let authToken = '';
let testHabitId = '';

// Helper function to make API calls
async function apiCall(method, endpoint, data = null, headers = {}) {
    try {
        const config = {
            method,
            url: `${API_BASE_URL}${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        if (data) {
            config.data = data;
        }

        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error(`❌ API Error: ${error.response?.data?.message || error.message}`);
        throw error;
    }
}

// Test user registration and login
async function setupTestUser() {
    console.log('🔧 Setting up test user...');

    try {
        // Try to login first
        const loginData = {
            identifier: TEST_EMAIL,
            password: TEST_PASSWORD
        };

        const loginResponse = await apiCall('POST', '/auth/login', loginData);
        authToken = loginResponse.token;
        console.log('✅ Logged in with existing user');

    } catch (error) {
        // If login fails, try to register
        console.log('📝 Creating new test user...');

        const signupData = {
            email: TEST_EMAIL,
            username: 'testuser',
            mobile: '1234567890'
        };

        const signupResponse = await apiCall('POST', '/auth/signup', signupData);
        console.log('✅ User created, OTP sent to console');

        // For testing, we'll use a mock OTP
        const verifyData = {
            email: TEST_EMAIL,
            otp: '123456', // This should work in development
            password: TEST_PASSWORD
        };

        const verifyResponse = await apiCall('POST', '/auth/verify-otp', verifyData);
        authToken = verifyResponse.token;
        console.log('✅ User verified and logged in');
    }
}

// Create a test habit
async function createTestHabit() {
    console.log('🎯 Creating test habit...');

    try {
        // First, get master habits
        const masterHabitsResponse = await apiCall('GET', '/master-habits');
        const masterHabits = masterHabitsResponse.habits;

        if (masterHabits.length === 0) {
            throw new Error('No master habits found. Please seed the database first.');
        }

        // Use the first master habit
        const masterHabit = masterHabits[0];
        console.log(`📋 Using master habit: ${masterHabit.title}`);

        // Create habit
        const habitData = {
            masterHabitId: masterHabit._id,
            title: 'Test Daily Habit',
            description: 'This is a test habit for completion testing',
            frequency: 'daily',
            timeOfDay: ['09:00'],
            primaryTime: '09:00',
            duration: '15 min',
            reminderEnabled: true,
            priority: 'high',
            tags: ['test', 'daily']
        };

        const habitResponse = await apiCall('POST', '/habits', habitData, {
            'Authorization': `Bearer ${authToken}`
        });

        testHabitId = habitResponse.habit._id;
        console.log(`✅ Test habit created with ID: ${testHabitId}`);

    } catch (error) {
        console.error('❌ Failed to create test habit:', error.message);
        throw error;
    }
}

// Test habit completion
async function testHabitCompletion() {
    console.log('🧪 Testing habit completion...');

    try {
        // Get initial habit state
        console.log('\n📊 Initial habit state:');
        const initialHabit = await apiCall('GET', `/habits/${testHabitId}`, null, {
            'Authorization': `Bearer ${authToken}`
        });

        console.log(`   Current Streak: ${initialHabit.habit.currentStreak}`);
        console.log(`   Best Streak: ${initialHabit.habit.maxStreak}`);
        console.log(`   History Entries: ${initialHabit.habit.history.length}`);

        // Toggle habit completion
        console.log('\n🔄 Toggling habit completion...');
        const toggleResponse = await apiCall('POST', `/habits/${testHabitId}/toggle`, null, {
            'Authorization': `Bearer ${authToken}`
        });

        console.log(`   ${toggleResponse.message}`);

        // Get updated habit state
        console.log('\n📈 Updated habit state:');
        const updatedHabit = await apiCall('GET', `/habits/${testHabitId}`, null, {
            'Authorization': `Bearer ${authToken}`
        });

        console.log(`   Current Streak: ${updatedHabit.habit.currentStreak}`);
        console.log(`   Best Streak: ${updatedHabit.habit.maxStreak}`);
        console.log(`   History Entries: ${updatedHabit.habit.history.length}`);

        // Show today's history entry
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = updatedHabit.habit.history.find(entry => entry.date === today);

        if (todayEntry) {
            console.log(`   Today's Entry: ${todayEntry.completed ? '✅ Completed' : '❌ Not Completed'}`);
            console.log(`   Completed At: ${todayEntry.completedAt || 'N/A'}`);
        } else {
            console.log('   Today\'s Entry: Not found');
        }

        // Test toggle again (should uncomplete)
        console.log('\n🔄 Toggling again (should uncomplete)...');
        await apiCall('POST', `/habits/${testHabitId}/toggle`, null, {
            'Authorization': `Bearer ${authToken}`
        });

        // Get final state
        console.log('\n📉 Final habit state:');
        const finalHabit = await apiCall('GET', `/habits/${testHabitId}`, null, {
            'Authorization': `Bearer ${authToken}`
        });

        console.log(`   Current Streak: ${finalHabit.habit.currentStreak}`);
        console.log(`   Best Streak: ${finalHabit.habit.maxStreak}`);
        console.log(`   History Entries: ${finalHabit.habit.history.length}`);

        const finalTodayEntry = finalHabit.habit.history.find(entry => entry.date === today);
        if (finalTodayEntry) {
            console.log(`   Today's Entry: ${finalTodayEntry.completed ? '✅ Completed' : '❌ Not Completed'}`);
        }

    } catch (error) {
        console.error('❌ Failed to test habit completion:', error.message);
        throw error;
    }
}

// Test daily stats
async function testDailyStats() {
    console.log('\n📊 Testing daily stats...');

    try {
        const statsResponse = await apiCall('GET', '/daily-stats/today', null, {
            'Authorization': `Bearer ${authToken}`
        });

        const stats = statsResponse.stats;
        console.log(`   Habits Completed Today: ${stats.habitsCompleted}`);
        console.log(`   Total Habits: ${stats.totalHabits}`);
        console.log(`   Completion Rate: ${stats.completionRate}%`);
        console.log(`   Current Streak: ${stats.streakDays}`);

    } catch (error) {
        console.error('❌ Failed to test daily stats:', error.message);
    }
}

// Main test function
async function runTests() {
    console.log('🚀 Starting HabityFy Habit Completion Tests\n');

    try {
        await setupTestUser();
        await createTestHabit();
        await testHabitCompletion();
        await testDailyStats();

        console.log('\n✅ All tests completed successfully!');
        console.log('\n📝 What to expect tomorrow:');
        console.log('   - The habit will show as not completed');
        console.log('   - You can complete it again to continue your streak');
        console.log('   - If you miss a day, your streak will reset to 0');

    } catch (error) {
        console.error('\n❌ Tests failed:', error.message);
        process.exit(1);
    }
}

// Run the tests
if (require.main === module) {
    runTests();
}

module.exports = {
    setupTestUser,
    createTestHabit,
    testHabitCompletion,
    testDailyStats
};
