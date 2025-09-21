// Test script for settings API
const API_BASE = 'http://localhost:5000/api';

// Test data
const testUser = {
    email: 'test@example.com',
    password: 'password123'
};

async function testSettingsAPI() {
    console.log('🧪 Testing Settings API...\n');

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
            return;
        }

        const loginData = await loginResponse.json();
        const token = loginData.token;
        console.log('✅ Login successful');

        // Step 2: Get current profile
        console.log('\n2. Getting current profile...');
        const profileResponse = await fetch(`${API_BASE}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!profileResponse.ok) {
            throw new Error('Failed to get profile');
        }

        const profileData = await profileResponse.json();
        console.log('✅ Current profile:', profileData.user);

        // Step 3: Update profile
        console.log('\n3. Updating profile...');
        const updateData = {
            username: 'UpdatedUser',
            email: 'updated@example.com',
            mobile: '9876543210'
        };

        const updateResponse = await fetch(`${API_BASE}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        });

        if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            throw new Error(`Failed to update profile: ${errorData.message}`);
        }

        const updateResult = await updateResponse.json();
        console.log('✅ Profile updated successfully:', updateResult.user);

        // Step 4: Test password reset
        console.log('\n4. Testing password reset...');
        const passwordData = {
            currentPassword: 'password123',
            newPassword: 'newpassword123'
        };

        const passwordResponse = await fetch(`${API_BASE}/auth/reset-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(passwordData)
        });

        if (!passwordResponse.ok) {
            const errorData = await passwordResponse.json();
            console.log('❌ Password reset failed:', errorData.message);
        } else {
            console.log('✅ Password reset successful');
        }

        console.log('\n🎉 Settings API test completed successfully!');
        console.log('\n📱 You can now test the frontend at: http://localhost:5173/settings');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testSettingsAPI();
