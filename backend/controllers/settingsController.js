const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { username, email, mobile } = req.body;
        const userId = req.user._id;

        // Check if email is already taken by another user
        if (email) {
            const existingUser = await User.findOne({
                email,
                _id: { $ne: userId }
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already taken by another user'
                });
            }
        }

        // Check if username is already taken by another user
        if (username) {
            const existingUser = await User.findOne({
                username,
                _id: { $ne: userId }
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Username is already taken by another user'
                });
            }
        }

        // Update user profile
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (mobile) updateData.mobile = mobile;

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove password from response
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            mobile: user.mobile,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: userResponse
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
};

// @desc    Reset user password
// @route   PUT /api/auth/reset-password
// @access  Private
const resetPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }

        // Get user with password
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const saltRounds = 12;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        user.passwordHash = newPasswordHash;
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            body: req.body,
            userId: req.user?._id
        });
        res.status(500).json({
            success: false,
            message: 'Error updating password',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Delete user account
// @route   DELETE /api/auth/delete-account
// @access  Private
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;

        // Delete user and all associated data
        // Note: In a production app, you might want to soft delete or archive data
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // TODO: Delete associated habits, notifications, and other user data
        // This would require additional cleanup logic

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting account'
        });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select('-passwordHash -otp -otpExpiresAt');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
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
    updateProfile,
    resetPassword,
    deleteAccount,
    getProfile
};
