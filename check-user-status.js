// Script to check user status and password setup
const API_BASE = 'http://localhost:5000/api';

// Test data
const testUser = {
    emailOrUsername: 'test@example.com',
    password: 'password123'
};

async function checkUserStatus() {
    console.log('🔍 Checking User Status...\n');

    try {
        // Step 1: Try to login
        console.log('1. Attempting login...');
        const loginResponse = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUser)
        });

        const loginData = await loginResponse.json();
        console.log('Login response:', JSON.stringify(loginData, null, 2));

        if (loginResponse.ok) {
            console.log('✅ Login successful');
            const token = loginData.token;

            // Step 2: Get user profile
            console.log('\n2. Getting user profile...');
            const profileResponse = await fetch(`${API_BASE}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const profileData = await profileResponse.json();
            console.log('Profile response:', JSON.stringify(profileData, null, 2));

            if (profileResponse.ok) {
                console.log('✅ Profile retrieved successfully');
                console.log('User details:', {
                    id: profileData.user._id,
                    email: profileData.user.email,
                    username: profileData.user.username,
                    isPasswordSet: profileData.user.isPasswordSet,
                    isEmailVerified: profileData.user.isEmailVerified,
                    isMobileVerified: profileData.user.isMobileVerified
                });
            } else {
                console.log('❌ Failed to get profile');
            }
        } else {
            console.log('❌ Login failed');
            console.log('This might mean:');
            console.log('- User does not exist');
            console.log('- User exists but password is not set');
            console.log('- User exists but OTP verification is incomplete');
        }

        console.log('\n📝 Next steps:');
        console.log('1. If login failed, create a new user at: http://localhost:5173/signup');
        console.log('2. Complete the OTP verification process');
        console.log('3. Then try the password reset again');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the check
checkUserStatus();
