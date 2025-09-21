#!/usr/bin/env node

/**
 * HabityFy Time Change Test Script
 * 
 * This script demonstrates how changing system time affects daily habits
 * Run with: node test-time-change.js
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const TEST_EMAIL = 'timetest@example.com';
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

// Get current system date
function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

// Setup test user and habit
async function setupTest() {
    console.log('🔧 Setting up test...');

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
        // Create new user
        console.log('📝 Creating new test user...');

        const signupData = {
            email: TEST_EMAIL,
            username: 'timetest',
            mobile: '1234567890'
        };

        await apiCall('POST', '/auth/signup', signupData);

        const verifyData = {
            email: TEST_EMAIL,
            otp: '123456',
            password: TEST_PASSWORD
        };

        const verifyResponse = await apiCall('POST', '/auth/verify-otp', verifyData);
        authToken = verifyResponse.token;
        console.log('✅ User created and verified');
    }

    // Create test habit
    const masterHabitsResponse = await apiCall('GET', '/master-habits');
    const masterHabit = masterHabitsResponse.habits[0];

    const habitData = {
        masterHabitId: masterHabit._id,
        title: 'Time Test Habit',
        description: 'Testing daily reset with time change',
        frequency: 'daily',
        timeOfDay: ['09:00'],
        primaryTime: '09:00'
    };

    const habitResponse = await apiCall('POST', '/habits', habitData, {
        'Authorization': `Bearer ${authToken}`
    });

    testHabitId = habitResponse.habit._id;
    console.log(`✅ Test habit created: ${testHabitId}`);
}

// Test habit completion for current date
async function testCurrentDate() {
    console.log('\n📅 Testing with current system date...');
    console.log(`   Current date: ${getCurrentDate()}`);

    try {
        // Get initial state
        const initialHabit = await apiCall('GET', `/habits/${testHabitId}`, null, {
            'Authorization': `Bearer ${authToken}`
        });

        console.log(`   Initial Streak: ${initialHabit.habit.currentStreak}`);
        console.log(`   History Entries: ${initialHabit.habit.history.length}`);

        // Complete the habit
        await apiCall('POST', `/habits/${testHabitId}/toggle`, null, {
            'Authorization': `Bearer ${authToken}`
        });

        // Check updated state
        const updatedHabit = await apiCall('GET', `/habits/${testHabitId}`, null, {
            'Authorization': `Bearer ${authToken}`
        });

        console.log(`   After Completion:`);
        console.log(`   - Current Streak: ${updatedHabit.habit.currentStreak}`);
        console.log(`   - Best Streak: ${updatedHabit.habit.maxStreak}`);
        console.log(`   - History Entries: ${updatedHabit.habit.history.length}`);

        // Show today's entry
        const today = getCurrentDate();
        const todayEntry = updatedHabit.habit.history.find(entry => entry.date === today);

        if (todayEntry) {
            console.log(`   - Today's Entry: ${todayEntry.completed ? '✅ Completed' : '❌ Not Completed'}`);
            console.log(`   - Completed At: ${todayEntry.completedAt || 'N/A'}`);
        }

    } catch (error) {
        console.error('❌ Failed to test current date:', error.message);
    }
}

// Simulate time change (this is just for demonstration)
async function simulateTimeChange() {
    console.log('\n⏰ Simulating time change to tomorrow...');
    console.log('   ⚠️  NOTE: You need to manually change your system time!');
    console.log('   Steps:');
    console.log('   1. Change system date to tomorrow');
    console.log('   2. Restart the backend server');
    console.log('   3. Run this script again');
    console.log('   4. The habit should show as not completed for the new date');
}

// Test with new date (after time change)
async function testNewDate() {
    console.log('\n📅 Testing with new system date...');
    console.log(`   Current date: ${getCurrentDate()}`);

    try {
        // Get habit state
        const habit = await apiCall('GET', `/habits/${testHabitId}`, null, {
            'Authorization': `Bearer ${authToken}`
        });

        console.log(`   Current Streak: ${habit.habit.currentStreak}`);
        console.log(`   Best Streak: ${habit.habit.maxStreak}`);
        console.log(`   History Entries: ${habit.habit.history.length}`);

        // Check if there's an entry for today (new date)
        const today = getCurrentDate();
        const todayEntry = habit.habit.history.find(entry => entry.date === today);

        if (todayEntry) {
            console.log(`   Today's Entry: ${todayEntry.completed ? '✅ Completed' : '❌ Not Completed'}`);
        } else {
            console.log(`   Today's Entry: Not found (habit resets for new day)`);
        }

        // Complete the habit for the new day
        console.log('\n🔄 Completing habit for new day...');
        await apiCall('POST', `/habits/${testHabitId}/toggle`, null, {
            'Authorization': `Bearer ${authToken}`
        });

        // Check updated state
        const updatedHabit = await apiCall('GET', `/habits/${testHabitId}`, null, {
            'Authorization': `Bearer ${authToken}`
        });

        console.log(`   After New Day Completion:`);
        console.log(`   - Current Streak: ${updatedHabit.habit.currentStreak}`);
        console.log(`   - Best Streak: ${updatedHabit.habit.maxStreak}`);
        console.log(`   - History Entries: ${updatedHabit.habit.history.length}`);

        // Show all history entries
        console.log('\n📊 Complete History:');
        updatedHabit.habit.history.forEach((entry, index) => {
            console.log(`   ${index + 1}. ${entry.date}: ${entry.completed ? '✅ Completed' : '❌ Not Completed'}`);
        });

    } catch (error) {
        console.error('❌ Failed to test new date:', error.message);
    }
}

// Main function
async function runTest() {
    console.log('🕐 HabityFy Time Change Test\n');

    try {
        await setupTest();
        await testCurrentDate();
        await simulateTimeChange();

        console.log('\n📝 Next Steps:');
        console.log('1. Change your system time to tomorrow');
        console.log('2. Restart the backend server');
        console.log('3. Run: node test-time-change.js new');
        console.log('4. Check if the habit resets for the new day');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Check if this is the "new" test after time change
if (process.argv[2] === 'new') {
    console.log('🕐 Testing after time change...\n');
    testNewDate().catch(console.error);
} else {
    runTest();
}
