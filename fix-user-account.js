// Script to directly fix user account setup
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://codriva:codriva123@cluster0.8jqjq.mongodb.net/habityfy?retryWrites=true&w=majority');
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// User schema (simplified)
const userSchema = new mongoose.Schema({
    email: String,
    username: String,
    mobile: String,
    passwordHash: String,
    isPasswordSet: Boolean,
    isEmailVerified: Boolean,
    isMobileVerified: Boolean,
    createdAt: Date,
    updatedAt: Date
});

const User = mongoose.model('User', userSchema);

async function fixUserAccount() {
    console.log('🔧 Fixing User Account Setup...\n');

    try {
        await connectDB();

        // Find the user
        const email = 'test@example.com';
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('❌ User not found');
            return;
        }

        console.log('📋 Current user status:', {
            email: user.email,
            username: user.username,
            isPasswordSet: user.isPasswordSet,
            isEmailVerified: user.isEmailVerified,
            isMobileVerified: user.isMobileVerified,
            hasPasswordHash: !!user.passwordHash
        });

        // Set password and complete setup
        const password = 'password123';
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        user.passwordHash = passwordHash;
        user.isPasswordSet = true;
        user.isEmailVerified = true;
        user.isMobileVerified = true;
        user.updatedAt = new Date();

        await user.save();

        console.log('✅ User account setup completed!');
        console.log('📋 Updated user status:', {
            email: user.email,
            username: user.username,
            isPasswordSet: user.isPasswordSet,
            isEmailVerified: user.isEmailVerified,
            isMobileVerified: user.isMobileVerified,
            hasPasswordHash: !!user.passwordHash
        });

        console.log('\n🎉 You can now:');
        console.log('1. Login at: http://localhost:5173/login');
        console.log('2. Use email: test@example.com');
        console.log('3. Use password: password123');
        console.log('4. Access settings at: http://localhost:5173/settings');
        console.log('5. Change your password in the Security tab');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
    }
}

// Run the fix
fixUserAccount();
