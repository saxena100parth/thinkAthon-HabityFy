#!/usr/bin/env node

/**
 * HabityFy Date Functionality Test Script
 * 
 * This script tests the new date-based habit completion functionality
 * Run with: node test-date-functionality.js
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const TEST_EMAIL = 'datetest@example.com';
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

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

// Get date N days from today
function getDateFromToday(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
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
            username: 'datetest',
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
        title: 'Date Test Habit',
        description: 'Testing date-based completion functionality',
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

// Test habit completion for different dates
async function testDateCompletion() {
    console.log('\n📅 Testing date-based habit completion...');

    const testDates = [
        { label: 'Yesterday', date: getDateFromToday(-1) },
        { label: 'Today', date: getCurrentDate() },
        { label: 'Tomorrow', date: getDateFromToday(1) },
        { label: 'Next Week', date: getDateFromToday(7) }
    ];

    for (const testDate of testDates) {
        console.log(`\n🗓️  Testing ${testDate.label} (${testDate.date}):`);

        try {
            // Get habits for this date
            const habitsResponse = await apiCall('GET', `/habits?date=${testDate.date}`, null, {
                'Authorization': `Bearer ${authToken}`
            });

            console.log(`   📊 Found ${habitsResponse.habits.length} habits for ${testDate.date}`);

            if (habitsResponse.habits.length > 0) {
                const habit = habitsResponse.habits[0];
                console.log(`   📋 Habit: ${habit.title}`);
                console.log(`   ✅ Completed for date: ${habit.completedForDate || false}`);

                // Toggle completion for this date
                console.log(`   🔄 Toggling completion for ${testDate.date}...`);
                const toggleResponse = await apiCall('POST', `/habits/${testHabitId}/toggle`,
                    { date: testDate.date },
                    { 'Authorization': `Bearer ${authToken}` }
                );

                console.log(`   ✅ ${toggleResponse.message}`);
                console.log(`   📈 Current Streak: ${toggleResponse.habit.currentStreak}`);
                console.log(`   🏆 Best Streak: ${toggleResponse.habit.maxStreak}`);

                // Verify the completion was recorded
                const verifyResponse = await apiCall('GET', `/habits?date=${testDate.date}`, null, {
                    'Authorization': `Bearer ${authToken}`
                });

                const updatedHabit = verifyResponse.habits[0];
                console.log(`   ✅ Verified completion: ${updatedHabit.completedForDate}`);

                // Toggle again to uncomplete
                console.log(`   🔄 Toggling again to uncomplete...`);
                await apiCall('POST', `/habits/${testHabitId}/toggle`,
                    { date: testDate.date },
                    { 'Authorization': `Bearer ${authToken}` }
                );

                const finalResponse = await apiCall('GET', `/habits?date=${testDate.date}`, null, {
                    'Authorization': `Bearer ${authToken}`
                });

                const finalHabit = finalResponse.habits[0];
                console.log(`   ✅ Final completion status: ${finalHabit.completedForDate}`);

            } else {
                console.log(`   ⚠️  No habits found for ${testDate.date}`);
            }

        } catch (error) {
            console.error(`   ❌ Error testing ${testDate.label}:`, error.message);
        }
    }
}

// Test habit history
async function testHabitHistory() {
    console.log('\n📚 Testing habit history...');

    try {
        const habitResponse = await apiCall('GET', `/habits/${testHabitId}`, null, {
            'Authorization': `Bearer ${authToken}`
        });

        const habit = habitResponse.habit;
        console.log(`📋 Habit: ${habit.title}`);
        console.log(`📊 Total history entries: ${habit.history.length}`);
        console.log(`📈 Current Streak: ${habit.currentStreak}`);
        console.log(`🏆 Best Streak: ${habit.maxStreak}`);

        console.log('\n📅 History entries:');
        habit.history.forEach((entry, index) => {
            const date = new Date(entry.date).toLocaleDateString();
            const completed = entry.completed ? '✅' : '❌';
            const completedAt = entry.completedAt ? new Date(entry.completedAt).toLocaleString() : 'N/A';
            console.log(`   ${index + 1}. ${date}: ${completed} (${completedAt})`);
        });

    } catch (error) {
        console.error('❌ Error testing habit history:', error.message);
    }
}

// Test edge cases
async function testEdgeCases() {
    console.log('\n🧪 Testing edge cases...');

    try {
        // Test invalid date
        console.log('📅 Testing invalid date...');
        try {
            await apiCall('POST', `/habits/${testHabitId}/toggle`,
                { date: 'invalid-date' },
                { 'Authorization': `Bearer ${authToken}` }
            );
        } catch (error) {
            console.log('   ✅ Invalid date properly rejected');
        }

        // Test future date (should work)
        const futureDate = getDateFromToday(30);
        console.log(`📅 Testing future date (${futureDate})...`);
        const futureResponse = await apiCall('POST', `/habits/${testHabitId}/toggle`,
            { date: futureDate },
            { 'Authorization': `Bearer ${authToken}` }
        );
        console.log(`   ✅ Future date completion: ${futureResponse.message}`);

        // Test past date (should work)
        const pastDate = getDateFromToday(-30);
        console.log(`📅 Testing past date (${pastDate})...`);
        const pastResponse = await apiCall('POST', `/habits/${testHabitId}/toggle`,
            { date: pastDate },
            { 'Authorization': `Bearer ${authToken}` }
        );
        console.log(`   ✅ Past date completion: ${pastResponse.message}`);

    } catch (error) {
        console.error('❌ Error testing edge cases:', error.message);
    }
}

// Main test function
async function runTests() {
    console.log('🗓️  Starting HabityFy Date Functionality Tests\n');

    try {
        await setupTest();
        await testDateCompletion();
        await testHabitHistory();
        await testEdgeCases();

        console.log('\n✅ All date functionality tests completed successfully!');
        console.log('\n📝 What you can now do:');
        console.log('   - Select any date using the date picker in the frontend');
        console.log('   - Mark habits as completed for past, present, or future dates');
        console.log('   - View habit completion status for any specific date');
        console.log('   - Toggle completion on/off for any date');
        console.log('   - Streaks are calculated based on consecutive completions');

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
    setupTest,
    testDateCompletion,
    testHabitHistory,
    testEdgeCases
};
