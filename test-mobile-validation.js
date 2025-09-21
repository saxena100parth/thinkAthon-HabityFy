// Test script for mobile validation fix
const API_BASE = 'http://localhost:5000/api';

// Test data
const testUser = {
    email: 'test@example.com',
    password: 'password123'
};

async function testMobileValidation() {
    console.log('🧪 Testing Mobile Validation Fix...\n');

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

        // Step 2: Test mobile number with country code
        console.log('\n2. Testing mobile number with country code (+918755193392)...');
        const updateData = {
            mobile: '+918755193392'
        };

        const updateResponse = await fetch(`${API_BASE}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        });

        const updateResult = await updateResponse.json();

        if (updateResponse.ok) {
            console.log('✅ Mobile number with country code accepted!');
            console.log('Updated profile:', updateResult.user);
        } else {
            console.log('❌ Mobile number with country code rejected:');
            console.log(JSON.stringify(updateResult, null, 2));
        }

        // Step 3: Test mobile number without country code
        console.log('\n3. Testing mobile number without country code (8755193392)...');
        const updateData2 = {
            mobile: '8755193392'
        };

        const updateResponse2 = await fetch(`${API_BASE}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData2)
        });

        const updateResult2 = await updateResponse2.json();

        if (updateResponse2.ok) {
            console.log('✅ Mobile number without country code accepted!');
            console.log('Updated profile:', updateResult2.user);
        } else {
            console.log('❌ Mobile number without country code rejected:');
            console.log(JSON.stringify(updateResult2, null, 2));
        }

        console.log('\n🎉 Mobile validation test completed!');
        console.log('\n📱 You can now test the frontend at: http://localhost:5173/settings');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testMobileValidation();
