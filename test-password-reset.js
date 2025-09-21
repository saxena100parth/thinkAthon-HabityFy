// Test script for password reset functionality
const API_BASE = 'http://localhost:5000/api';

// Test data
const testUser = {
    email: 'test@example.com',
    password: 'password123'
};

async function testPasswordReset() {
    console.log('🧪 Testing Password Reset Functionality...\n');

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

        const resetResponse = await fetch(`${API_BASE}/auth/reset-password`, {
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

            // Step 3: Test login with new password
            console.log('\n3. Testing login with new password...');
            const newLoginResponse = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: testUser.email,
                    password: 'newpassword123'
                })
            });

            if (newLoginResponse.ok) {
                console.log('✅ Login with new password successful!');
            } else {
                console.log('❌ Login with new password failed');
            }
        } else {
            console.log('❌ Password reset failed:');
            console.log('Status:', resetResponse.status);
            console.log('Error:', resetResult.message);
        }

        // Step 4: Test password reset with incorrect current password
        console.log('\n4. Testing password reset with incorrect current password...');
        const wrongPasswordData = {
            currentPassword: 'wrongpassword',
            newPassword: 'anotherpassword123'
        };

        const wrongResetResponse = await fetch(`${API_BASE}/auth/reset-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(wrongPasswordData)
        });

        const wrongResetResult = await wrongResetResponse.json();
        console.log('Wrong password test - Status:', wrongResetResponse.status);
        console.log('Wrong password test - Response:', JSON.stringify(wrongResetResult, null, 2));

        console.log('\n🎉 Password reset test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Full error:', error);
    }
}

// Run the test
testPasswordReset();
