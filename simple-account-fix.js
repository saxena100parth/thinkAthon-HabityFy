// Simple script to fix account using API calls
const API_BASE = 'http://localhost:5000/api';

async function fixAccountWithAPI() {
    console.log('🔧 Fixing Account Setup with API...\n');

    try {
        const email = 'test@example.com';
        
        // Step 1: Try to get OTP for password reset
        console.log('1. Requesting password reset OTP...');
        const otpResponse = await fetch(`${API_BASE}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const otpData = await otpResponse.json();
        console.log('OTP Response:', JSON.stringify(otpData, null, 2));

        if (otpResponse.ok) {
            console.log('✅ OTP sent successfully');
            console.log('📧 Check the backend console for the OTP code');
            console.log('Look for: "OTP for test@example.com: XXXXXX"');
            
            // For now, let's try a common OTP (this is just for testing)
            console.log('\n2. Trying to complete setup...');
            console.log('Note: You need to get the actual OTP from the backend console');
            console.log('Then run: node simple-account-fix.js complete <OTP>');
            
        } else {
            console.log('❌ Failed to send OTP:', otpData.message);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function completeWithOTP(otp) {
    console.log('🔧 Completing setup with OTP...\n');

    try {
        const email = 'test@example.com';
        const password = 'password123';

        // Try to verify OTP and set password
        const verifyResponse = await fetch(`${API_BASE}/auth/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                otp,
                password
            })
        });

        const verifyData = await verifyResponse.json();
        console.log('Verify Response:', JSON.stringify(verifyData, null, 2));

        if (verifyResponse.ok) {
            console.log('✅ Account setup completed successfully!');
            
            // Test login
            console.log('\n3. Testing login...');
            const loginResponse = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailOrUsername: email,
                    password
                })
            });

            const loginData = await loginResponse.json();
            if (loginResponse.ok) {
                console.log('✅ Login successful!');
                console.log('\n🎉 You can now:');
                console.log('1. Go to: http://localhost:5173/settings');
                console.log('2. Navigate to Security tab');
                console.log('3. Change your password');
            } else {
                console.log('❌ Login failed:', loginData.message);
            }
        } else {
            console.log('❌ OTP verification failed:', verifyData.message);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Check command line arguments
const args = process.argv.slice(2);
if (args.length > 0 && args[0] === 'complete') {
    const otp = args[1];
    if (otp) {
        completeWithOTP(otp);
    } else {
        console.log('Usage: node simple-account-fix.js complete <OTP>');
    }
} else {
    fixAccountWithAPI();
}
