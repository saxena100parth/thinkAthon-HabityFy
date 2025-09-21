// Test script for notification system
const API_BASE = 'http://localhost:5000/api';

// Test data
const testUser = {
    email: 'test@example.com',
    password: 'password123'
};

async function testNotificationSystem() {
    console.log('🧪 Testing Notification System...\n');

    try {
        // Step 1: Login to get token
        console.log('1. Logging in...');
        const loginResponse = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUser)
        });

        if (!loginResponse.ok) {
            console.log('❌ Login failed. Creating new user...');

            // Create user first
            const signupResponse = await fetch(`${API_BASE}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: testUser.email,
                    username: 'testuser',
                    mobile: '1234567890'
                })
            });

            if (!signupResponse.ok) {
                throw new Error('Failed to create user');
            }

            console.log('✅ User created. Please verify OTP and login manually.');
            return;
        }

        const loginData = await loginResponse.json();
        const token = loginData.token;
        console.log('✅ Login successful');

        // Step 2: Get notifications
        console.log('\n2. Fetching notifications...');
        const notificationsResponse = await fetch(`${API_BASE}/notifications`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!notificationsResponse.ok) {
            throw new Error('Failed to fetch notifications');
        }

        const notificationsData = await notificationsResponse.json();
        console.log(`✅ Found ${notificationsData.notifications.length} notifications`);

        // Display notifications
        notificationsData.notifications.forEach((notification, index) => {
            console.log(`${index + 1}. [${notification.type.toUpperCase()}] ${notification.message}`);
        });

        // Step 3: Get unread count
        console.log('\n3. Getting unread count...');
        const unreadResponse = await fetch(`${API_BASE}/notifications/unread-count`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!unreadResponse.ok) {
            throw new Error('Failed to fetch unread count');
        }

        const unreadData = await unreadResponse.json();
        console.log(`✅ Unread notifications: ${unreadData.unreadCount}`);

        // Step 4: Mark first notification as read (if any)
        if (notificationsData.notifications.length > 0) {
            console.log('\n4. Marking first notification as read...');
            const firstNotification = notificationsData.notifications[0];

            const markReadResponse = await fetch(`${API_BASE}/notifications/${firstNotification._id}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (markReadResponse.ok) {
                console.log('✅ Notification marked as read');
            } else {
                console.log('❌ Failed to mark notification as read');
            }
        }

        // Step 5: Create a test notification
        console.log('\n5. Creating test notification...');
        const testNotification = {
            message: '🧪 This is a test notification from the API!',
            type: 'general',
            scheduledAt: new Date()
        };

        const createResponse = await fetch(`${API_BASE}/notifications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(testNotification)
        });

        if (createResponse.ok) {
            console.log('✅ Test notification created');
        } else {
            console.log('❌ Failed to create test notification');
        }

        console.log('\n🎉 Notification system test completed successfully!');
        console.log('\n📱 You can now test the frontend at: http://localhost:5173/notifications');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testNotificationSystem();
