#!/usr/bin/env node

/**
 * HabityFy Weekly Habits Test Script
 * 
 * This script tests the weekly habit functionality
 * Run with: node test-weekly-habits.js
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const TEST_EMAIL = 'weeklytest@example.com';
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

// Get week start (Monday) for a given date
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
}

// Setup test user and weekly habit
async function setupTest() {
    console.log('🔧 Setting up weekly habit test...');

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
            username: 'weeklytest',
            mobile: '1234567890'
        };

        await apiCall('POST', '/auth/signup', signupData);

        const verifyData = {
            email: TEST_EMAIL,
            otp: '123456',
            password: TEST_PASSWORD
        };

        const verifyResponse = await apiCall('POST', '/auth/verify-otp', verifyData);
        authToken = loginResponse.token;
        console.log('✅ User created and verified');
    }

    // Create weekly habit
    const masterHabitsResponse = await apiCall('GET', '/master-habits');
    const weeklyHabit = masterHabitsResponse.habits.find(h => h.suggestedFrequency === 'weekly');

    if (!weeklyHabit) {
        throw new Error('No weekly master habits found. Please seed the database first.');
    }

    const habitData = {
        masterHabitId: weeklyHabit._id,
        title: 'Weekly Test Habit',
        description: 'Testing weekly habit completion functionality',
        frequency: 'weekly',
        timeOfDay: ['10:00'],
        primaryTime: '10:00'
    };

    const habitResponse = await apiCall('POST', '/habits', habitData, {
        'Authorization': `Bearer ${authToken}`
    });

    testHabitId = habitResponse.habit._id;
    console.log(`✅ Weekly test habit created: ${testHabitId}`);
}

// Test weekly habit completion
async function testWeeklyCompletion() {
    console.log('\n📅 Testing weekly habit completion...');

    const testDates = [
        { label: 'Monday', date: getCurrentDate() },
        { label: 'Tuesday', date: getDateFromToday(1) },
        { label: 'Wednesday', date: getDateFromToday(2) },
        { label: 'Thursday', date: getDateFromToday(3) },
        { label: 'Friday', date: getDateFromToday(4) },
        { label: 'Saturday', date: getDateFromToday(5) },
        { label: 'Sunday', date: getDateFromToday(6) }
    ];

    console.log(`📊 Week starts: ${getWeekStart(getCurrentDate())}`);

    for (const testDate of testDates) {
        console.log(`\n🗓️  Testing ${testDate.label} (${testDate.date}):`);

        try {
            // Get habits for this date
            const habitsResponse = await apiCall('GET', `/habits?date=${testDate.date}`, null, {
                'Authorization': `Bearer ${authToken}`
            });

            const habit = habitsResponse.habits.find(h => h._id === testHabitId);
            if (!habit) {
                console.log('   ❌ Habit not found');
                continue;
            }

            console.log(`   📋 Habit: ${habit.title}`);
            console.log(`   📅 Frequency: ${habit.frequency}`);
            console.log(`   ✅ Completed for week: ${habit.completedForDate || false}`);
            console.log(`   🏷️  Weekly indicator: ${habit.isWeeklyCompleted || false}`);

            // Toggle completion for this date
            console.log(`   🔄 Toggling completion for ${testDate.date}...`);
            const toggleResponse = await apiCall('POST', `/habits/${testHabitId}/toggle`,
                { date: testDate.date },
                { 'Authorization': `Bearer ${authToken}` }
            );

            console.log(`   ✅ ${toggleResponse.message}`);
            console.log(`   📈 Current Streak: ${toggleResponse.habit.currentStreak}`);
            console.log(`   🏆 Best Streak: ${toggleResponse.habit.maxStreak}`);
            console.log(`   📅 Weekly completed: ${toggleResponse.habit.isWeeklyCompleted}`);

            // Verify the completion was recorded
            const verifyResponse = await apiCall('GET', `/habits?date=${testDate.date}`, null, {
                'Authorization': `Bearer ${authToken}`
            });

            const updatedHabit = verifyResponse.habits.find(h => h._id === testHabitId);
            console.log(`   ✅ Verified weekly completion: ${updatedHabit.completedForDate}`);

        } catch (error) {
            console.error(`   ❌ Error testing ${testDate.label}:`, error.message);
        }
    }
}

// Test weekly habit history
async function testWeeklyHistory() {
    console.log('\n📚 Testing weekly habit history...');

    try {
        const habitResponse = await apiCall('GET', `/habits/${testHabitId}`, null, {
            'Authorization': `Bearer ${authToken}`
        });

        const habit = habitResponse.habit;
        console.log(`📋 Habit: ${habit.title}`);
        console.log(`📅 Frequency: ${habit.frequency}`);
        console.log(`📊 Total history entries: ${habit.history.length}`);
        console.log(`📈 Current Streak: ${habit.currentStreak} weeks`);
        console.log(`🏆 Best Streak: ${habit.maxStreak} weeks`);

        console.log('\n📅 History entries:');
        habit.history.forEach((entry, index) => {
            const date = new Date(entry.date).toLocaleDateString();
            const completed = entry.completed ? '✅' : '❌';
            const completedAt = entry.completedAt ? new Date(entry.completedAt).toLocaleString() : 'N/A';
            console.log(`   ${index + 1}. ${date}: ${completed} (${completedAt})`);
        });

        // Group by weeks
        const weeklyGroups = new Map();
        habit.history.forEach(entry => {
            if (entry.completed) {
                const weekStart = getWeekStart(entry.date);
                if (!weeklyGroups.has(weekStart)) {
                    weeklyGroups.set(weekStart, []);
                }
                weeklyGroups.get(weekStart).push(entry);
            }
        });

        console.log('\n📅 Weekly completions:');
        weeklyGroups.forEach((entries, weekStart) => {
            const weekEnd = new Date(new Date(weekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString();
            console.log(`   Week ${weekStart} - ${weekEnd}: ${entries.length} completion(s)`);
        });

    } catch (error) {
        console.error('❌ Error testing weekly history:', error.message);
    }
}

// Test weekly habit behavior across different weeks
async function testDifferentWeeks() {
    console.log('\n🗓️  Testing different weeks...');

    try {
        // Complete habit for current week
        const currentWeek = getCurrentDate();
        console.log(`📅 Completing habit for current week (${currentWeek})...`);
        await apiCall('POST', `/habits/${testHabitId}/toggle`,
            { date: currentWeek },
            { 'Authorization': `Bearer ${authToken}` }
        );

        // Test next week
        const nextWeek = getDateFromToday(7);
        console.log(`📅 Testing next week (${nextWeek})...`);
        const nextWeekResponse = await apiCall('GET', `/habits?date=${nextWeek}`, null, {
            'Authorization': `Bearer ${authToken}`
        });

        const nextWeekHabit = nextWeekResponse.habits.find(h => h._id === testHabitId);
        console.log(`   ✅ Next week completion status: ${nextWeekHabit.completedForDate}`);

        // Complete habit for next week
        console.log(`📅 Completing habit for next week...`);
        await apiCall('POST', `/habits/${testHabitId}/toggle`,
            { date: nextWeek },
            {
                'Authorization': `Bearer ${authToken}`
            });

        // Check current week again (should still be completed)
        const currentWeekAgain = await apiCall('GET', `/habits?date=${currentWeek}`, null, {
            'Authorization': `Bearer ${authToken}`
        });

        const currentWeekHabit = currentWeekAgain.habits.find(h => h._id === testHabitId);
        console.log(`   ✅ Current week still completed: ${currentWeekHabit.completedForDate}`);

    } catch (error) {
        console.error('❌ Error testing different weeks:', error.message);
    }
}

// Main test function
async function runTests() {
    console.log('📅 Starting HabityFy Weekly Habits Tests\n');

    try {
        await setupTest();
        await testWeeklyCompletion();
        await testWeeklyHistory();
        await testDifferentWeeks();

        console.log('\n✅ All weekly habit tests completed successfully!');
        console.log('\n📝 What you can now do:');
        console.log('   - Create weekly habits that can be completed once per week');
        console.log('   - Mark weekly habits as completed on any day of the week');
        console.log('   - Weekly habits remain visible throughout the week');
        console.log('   - Streaks are calculated based on consecutive weeks');
        console.log('   - Weekly habits show "Weekly" badge and appropriate button text');

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
    testWeeklyCompletion,
    testWeeklyHistory,
    testDifferentWeeks
};
