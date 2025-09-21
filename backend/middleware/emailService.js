// Mock email service for development
// In production, this would integrate with services like SendGrid, AWS SES, etc.

const emailService = {
    // Mock OTP sending
    sendOTP: async (email, otp) => {
        console.log('\n📧 EMAIL NOTIFICATION');
        console.log('==================');
        console.log(`To: ${email}`);
        console.log(`Subject: HabityFy - Verification Code`);
        console.log(`Message: Your verification code is: ${otp}`);
        console.log(`Valid for: 10 minutes`);
        console.log('==================\n');

        // Simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            success: true,
            messageId: `mock-${Date.now()}`,
            message: 'OTP sent successfully (check console for details)'
        };
    },

    // Mock password reset email
    sendPasswordReset: async (email, otp) => {
        console.log('\n📧 PASSWORD RESET EMAIL');
        console.log('======================');
        console.log(`To: ${email}`);
        console.log(`Subject: HabityFy - Password Reset Code`);
        console.log(`Message: Your password reset code is: ${otp}`);
        console.log(`Valid for: 10 minutes`);
        console.log('======================\n');

        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            success: true,
            messageId: `mock-reset-${Date.now()}`,
            message: 'Password reset code sent successfully (check console for details)'
        };
    },

    // Mock welcome email
    sendWelcome: async (email, username) => {
        console.log('\n📧 WELCOME EMAIL');
        console.log('===============');
        console.log(`To: ${email}`);
        console.log(`Subject: Welcome to HabityFy!`);
        console.log(`Message: Welcome ${username}! Start building great habits today.`);
        console.log('===============\n');

        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            success: true,
            messageId: `mock-welcome-${Date.now()}`,
            message: 'Welcome email sent successfully (check console for details)'
        };
    },

    // Mock habit reminder
    sendHabitReminder: async (email, habitTitle, timeOfDay) => {
        console.log('\n📧 HABIT REMINDER');
        console.log('================');
        console.log(`To: ${email}`);
        console.log(`Subject: HabityFy - Time for your habit!`);
        console.log(`Message: It's time for "${habitTitle}" at ${timeOfDay}`);
        console.log('================\n');

        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            success: true,
            messageId: `mock-reminder-${Date.now()}`,
            message: 'Habit reminder sent successfully (check console for details)'
        };
    }
};

module.exports = emailService;
