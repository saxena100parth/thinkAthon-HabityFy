// Script to complete account setup for existing user
const API_BASE = 'http://localhost:5000/api';

async function completeAccountSetup() {
    console.log('🔧 Completing Account Setup...\n');

    try {
        // Step 1: Check if user exists by trying to get OTP
        console.log('1. Checking if user exists...');
        const email = 'test@example.com'; // Change this to your email
        
        const otpResponse = await fetch(`${API_BASE}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const otpData = await otpResponse.json();
        console.log('OTP response:', JSON.stringify(otpData, null, 2));

        if (otpResponse.ok) {
            console.log('✅ User exists and OTP sent');
            console.log('📧 Check your console for the OTP code');
            
            // Step 2: Get OTP from console (you'll need to check backend logs)
            console.log('\n2. Please check the backend console for the OTP code');
            console.log('Look for a message like: "OTP for test@example.com: XXXXXX"');
            console.log('\nOnce you have the OTP, run this script again with the OTP');
            
        } else {
            console.log('❌ User does not exist or error occurred');
            console.log('Please create a new user at: http://localhost:5173/signup');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Function to complete setup with OTP
async function completeWithOTP(otp) {
    console.log('🔧 Completing setup with OTP...\n');

    try {
        const email = 'test@example.com'; // Change this to your email
        const password = 'password123'; // Change this to your desired password

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
        console.log('Verify response:', JSON.stringify(verifyData, null, 2));

        if (verifyResponse.ok) {
            console.log('✅ Account setup completed successfully!');
            console.log('You can now login and use the password reset feature');
            
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
                console.log('You can now access: http://localhost:5173/settings');
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
        console.log('Usage: node complete-account-setup.js complete <OTP>');
    }
} else {
    completeAccountSetup();
}
