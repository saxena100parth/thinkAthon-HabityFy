const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const emailService = require('../middleware/emailService');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// @desc    Sign up user (send OTP)
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
    try {
        const { email, username, mobile } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }, { mobile }]
        });

        if (existingUser) {
            const field = existingUser.email === email ? 'email' :
                existingUser.username === username ? 'username' : 'mobile';
            return res.status(400).json({
                success: false,
                message: `User with this ${field} already exists`
            });
        }

        // Create new user (without password)
        const user = await User.create({
            email,
            username,
            mobile,
        });

        // Create and send OTP
        const otpRecord = await OTP.createOTP(email, 'signup');
        await emailService.sendOTP(email, otpRecord.otp);

        res.status(201).json({
            success: true,
            message: 'OTP sent to your email address',
            data: {
                email: user.email,
                username: user.username,
                mobile: user.mobile
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user. Please try again.'
        });
    }
};

// @desc    Verify OTP and set password
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Find and verify OTP
        const otpRecord = await OTP.findOne({
            email,
            type: 'signup',
            isUsed: false
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'No valid OTP found'
            });
        }

        const otpVerification = otpRecord.verifyOTP(otp);
        if (!otpVerification.valid) {
            return res.status(400).json({
                success: false,
                message: otpVerification.message
            });
        }

        // Set password and mark email as verified
        user.passwordHash = password;
        user.isPasswordSet = true;
        user.isEmailVerified = true;
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Send welcome email
        await emailService.sendWelcome(email, user.username);

        res.json({
            success: true,
            message: 'Account created successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                mobile: user.mobile,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying OTP. Please try again.'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        // Find user by email or username and include password
        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        }).select('+passwordHash');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password is set
        if (!user.isPasswordSet) {
            return res.status(400).json({
                success: false,
                message: 'Please complete your account setup first'
            });
        }

        // Check if password matches
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                mobile: user.mobile,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in. Please try again.'
        });
    }
};

// @desc    Forgot password (send OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Create and send OTP
        const otpRecord = await OTP.createOTP(email, 'forgot_password');
        await emailService.sendPasswordReset(email, otpRecord.otp);

        res.json({
            success: true,
            message: 'Password reset code sent to your email'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending reset code. Please try again.'
        });
    }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Find and verify OTP
        const otpRecord = await OTP.findOne({
            email,
            type: 'forgot_password',
            isUsed: false
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'No valid OTP found'
            });
        }

        const otpVerification = otpRecord.verifyOTP(otp);
        if (!otpVerification.valid) {
            return res.status(400).json({
                success: false,
                message: otpVerification.message
            });
        }

        // Update password
        user.passwordHash = password;
        user.isPasswordSet = true;
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password. Please try again.'
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-passwordHash');

        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                mobile: user.mobile,
                isEmailVerified: user.isEmailVerified,
                isMobileVerified: user.isMobileVerified,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
};

module.exports = {
    signup,
    verifyOTP,
    login,
    forgotPassword,
    resetPassword,
    getProfile
};