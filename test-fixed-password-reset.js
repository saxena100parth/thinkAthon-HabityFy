// Test script for fixed password reset functionality
const API_BASE = 'http://localhost:5000/api';

// Test data
const testUser = {
    email: 'test@example.com',
    password: 'password123'
};

async function testFixedPasswordReset() {
    console.log('🧪 Testing Fixed Password Reset Functionality...\n');

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
            console.log('❌ Login failed. Please create a user first.');
            console.log('You can create a user by visiting: http://localhost:5173/signup');
            return;
        }

        const loginData = await loginResponse.json();
        const token = loginData.token;
        console.log('✅ Login successful');

        // Step 2: Test password reset with correct current password
        console.log('\n2. Testing password reset with correct current password...');
        const passwordData = {
            currentPassword: 'password123',
            newPassword: 'newpassword123'
        };

        const resetResponse = await fetch(`${API_BASE}/auth/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(passwordData)
        });

        const resetResult = await resetResponse.json();
        console.log('Response status:', resetResponse.status);
        console.log('Response data:', JSON.stringify(resetResult, null, 2));

        if (resetResponse.ok) {
            console.log('✅ Password reset successful!');
        } else {
            console.log('❌ Password reset failed:');
            console.log('Status:', resetResponse.status);
            console.log('Error:', resetResult.message);
        }

        console.log('\n🎉 Fixed password reset test completed!');
        console.log('\n📱 You can now test the frontend at: http://localhost:5173/settings');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Full error:', error);
    }
}

// Run the test
testFixedPasswordReset();
