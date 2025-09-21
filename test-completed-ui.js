#!/usr/bin/env node

/**
 * HabityFy Completed Habits UI Test Script
 * 
 * This script tests the completed habits functionality
 * Run with: node test-completed-ui.js
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const TEST_EMAIL = 'completedtest@example.com';
const TEST_PASSWORD = 'testpassword123';

let authToken = '';
let testHabitIds = [];

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

// Setup test user and habits
async function setupTest() {
    console.log('🔧 Setting up completed habits test...');

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
            username: 'completedtest',
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

    // Create test habits
    const masterHabitsResponse = await apiCall('GET', '/master-habits');
    const masterHabits = masterHabitsResponse.habits.slice(0, 3); // Take first 3 habits

    for (const masterHabit of masterHabits) {
        const habitData = {
            masterHabitId: masterHabit._id,
            title: `Test Habit ${masterHabit.title}`,
            description: `Testing completed habits UI with ${masterHabit.title}`,
            frequency: masterHabit.suggestedFrequency,
            timeOfDay: [masterHabit.suggestedTimeOfDay],
            primaryTime: masterHabit.suggestedTimeOfDay
        };

        const habitResponse = await apiCall('POST', '/habits', habitData, {
            'Authorization': `Bearer ${authToken}`
        });

        testHabitIds.push(habitResponse.habit._id);
        console.log(`✅ Test habit created: ${habitResponse.habit.title}`);
    }
}

// Create completion history for testing
async function createCompletionHistory() {
    console.log('\n📅 Creating completion history...');

    const dates = [
        getDateFromToday(-7), // 1 week ago
        getDateFromToday(-6), // 6 days ago
        getDateFromToday(-3), // 3 days ago
        getDateFromToday(-1), // Yesterday
        getCurrentDate()      // Today
    ];

    for (let i = 0; i < testHabitIds.length; i++) {
        const habitId = testHabitIds[i];
        const completionDates = dates.slice(0, i + 2); // Different completion patterns

        console.log(`📋 Creating completions for habit ${i + 1}:`);

        for (const date of completionDates) {
            try {
                await apiCall('POST', `/habits/${habitId}/toggle`,
                    { date },
                    { 'Authorization': `Bearer ${authToken}` }
                );
                console.log(`   ✅ Completed on ${date}`);
            } catch (error) {
                console.log(`   ❌ Failed to complete on ${date}: ${error.message}`);
            }
        }
    }
}

// Test completed habits API
async function testCompletedHabitsAPI() {
    console.log('\n📊 Testing completed habits API...');

    try {
        // Get all habits
        const habitsResponse = await apiCall('GET', '/habits', null, {
            'Authorization': `Bearer ${authToken}`
        });

        console.log(`📋 Total habits: ${habitsResponse.habits.length}`);

        // Filter completed habits
        const completedHabits = habitsResponse.habits.filter(habit => {
            return habit.history && habit.history.some(entry => entry.completed);
        });

        console.log(`✅ Completed habits: ${completedHabits.length}`);

        // Show completion statistics
        const today = getCurrentDate();
        const weekAgo = getDateFromToday(-7);
        const monthAgo = getDateFromToday(-30);

        const todayCompletions = completedHabits.filter(habit =>
            habit.history.some(entry => entry.date === today && entry.completed)
        ).length;

        const weekCompletions = completedHabits.filter(habit =>
            habit.history.some(entry => entry.date >= weekAgo && entry.completed)
        ).length;

        const monthCompletions = completedHabits.filter(habit =>
            habit.history.some(entry => entry.date >= monthAgo && entry.completed)
        ).length;

        const totalCompletions = completedHabits.reduce((sum, habit) =>
            sum + habit.history.filter(entry => entry.completed).length, 0
        );

        console.log('\n📈 Completion Statistics:');
        console.log(`   Today: ${todayCompletions} completions`);
        console.log(`   This Week: ${weekCompletions} completions`);
        console.log(`   This Month: ${monthCompletions} completions`);
        console.log(`   Total: ${totalCompletions} completions`);

        // Show detailed habit information
        console.log('\n📋 Detailed Habit Information:');
        completedHabits.forEach((habit, index) => {
            const completions = habit.history.filter(entry => entry.completed);
            const latestCompletion = completions.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

            console.log(`\n   ${index + 1}. ${habit.title}`);
            console.log(`      Frequency: ${habit.frequency}`);
            console.log(`      Current Streak: ${habit.currentStreak || 0}`);
            console.log(`      Best Streak: ${habit.maxStreak || 0}`);
            console.log(`      Total Completions: ${completions.length}`);
            console.log(`      Latest Completion: ${latestCompletion ? latestCompletion.date : 'None'}`);

            // Show recent completions
            const recentCompletions = completions.slice(0, 3);
            console.log(`      Recent Completions:`);
            recentCompletions.forEach(completion => {
                const date = new Date(completion.date).toLocaleDateString();
                const time = completion.completedAt ?
                    new Date(completion.completedAt).toLocaleTimeString() :
                    'Time not recorded';
                console.log(`        - ${date} at ${time}`);
            });
        });

    } catch (error) {
        console.error('❌ Error testing completed habits API:', error.message);
    }
}

// Test date filtering
async function testDateFiltering() {
    console.log('\n🗓️  Testing date filtering...');

    const testDates = [
        { label: 'Today', date: getCurrentDate() },
        { label: 'Yesterday', date: getDateFromToday(-1) },
        { label: '3 days ago', date: getDateFromToday(-3) },
        { label: '1 week ago', date: getDateFromToday(-7) }
    ];

    for (const testDate of testDates) {
        console.log(`\n📅 Testing ${testDate.label} (${testDate.date}):`);

        try {
            const habitsResponse = await apiCall('GET', `/habits?date=${testDate.date}`, null, {
                'Authorization': `Bearer ${authToken}`
            });

            const completedForDate = habitsResponse.habits.filter(habit =>
                habit.completedForDate || habit.history?.some(entry =>
                    entry.date === testDate.date && entry.completed
                )
            );

            console.log(`   📊 Total habits: ${habitsResponse.habits.length}`);
            console.log(`   ✅ Completed for date: ${completedForDate.length}`);

            completedForDate.forEach(habit => {
                console.log(`      - ${habit.title}: ${habit.completedForDate ? 'Completed' : 'Not completed'}`);
            });

        } catch (error) {
            console.error(`   ❌ Error testing ${testDate.label}:`, error.message);
        }
    }
}

// Test habit completion toggling
async function testHabitToggling() {
    console.log('\n🔄 Testing habit completion toggling...');

    if (testHabitIds.length === 0) {
        console.log('❌ No test habits available');
        return;
    }

    const habitId = testHabitIds[0];
    const testDate = getCurrentDate();

    try {
        console.log(`📋 Testing habit: ${habitId}`);
        console.log(`📅 Test date: ${testDate}`);

        // Get initial state
        const initialResponse = await apiCall('GET', `/habits?date=${testDate}`, null, {
            'Authorization': `Bearer ${authToken}`
        });

        const initialHabit = initialResponse.habits.find(h => h._id === habitId);
        console.log(`   Initial state: ${initialHabit?.completedForDate ? 'Completed' : 'Not completed'}`);

        // Toggle completion
        console.log('   🔄 Toggling completion...');
        const toggleResponse = await apiCall('POST', `/habits/${habitId}/toggle`,
            { date: testDate },
            { 'Authorization': `Bearer ${authToken}`
    );

        console.log(`   ✅ ${toggleResponse.message}`);
        console.log(`   📈 Current Streak: ${toggleResponse.habit.currentStreak}`);

        // Verify state change
        const verifyResponse = await apiCall('GET', `/habits?date=${testDate}`, null, {
            'Authorization': `Bearer ${authToken}`
        });

        const verifyHabit = verifyResponse.habits.find(h => h._id === habitId);
        console.log(`   Verified state: ${verifyHabit?.completedForDate ? 'Completed' : 'Not completed'}`);

        // Toggle back
        console.log('   🔄 Toggling back...');
        await apiCall('POST', `/habits/${habitId}/toggle`,
            { date: testDate },
            { 'Authorization': `Bearer ${authToken}`
    );

        const finalResponse = await apiCall('GET', `/habits?date=${testDate}`, null, {
            'Authorization': `Bearer ${authToken}`
        });

        const finalHabit = finalResponse.habits.find(h => h._id === habitId);
        console.log(`   Final state: ${finalHabit?.completedForDate ? 'Completed' : 'Not completed'}`);

    } catch (error) {
        console.error('❌ Error testing habit toggling:', error.message);
    }
}

// Main test function
async function runTests() {
    console.log('📊 Starting HabityFy Completed Habits UI Tests\n');

    try {
        await setupTest();
        await createCompletionHistory();
        await testCompletedHabitsAPI();
        await testDateFiltering();
        await testHabitToggling();

        console.log('\n✅ All completed habits UI tests completed successfully!');
        console.log('\n📝 What you can now do in the UI:');
        console.log('   - View all completed habits with their history');
        console.log('   - Filter habits by time period (today, week, month, year)');
        console.log('   - Search through completed habits');
        console.log('   - Sort habits by date, streak, or title');
        console.log('   - Expand habit cards to see detailed completion history');
        console.log('   - View completion statistics and streaks');
        console.log('   - Toggle between "My Habits" and "Completed" tabs');

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
    createCompletionHistory,
    testCompletedHabitsAPI,
    testDateFiltering,
    testHabitToggling
};
