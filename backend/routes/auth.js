const express = require('express');
const router = express.Router();
const {
    signup,
    verifyOTP,
    login,
    forgotPassword,
    resetPassword,
    getProfile
} = require('../controllers/authController');
const {
    updateProfile,
    resetPassword: resetUserPassword,
    deleteAccount
} = require('../controllers/settingsController');
const { validate, schemas } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

// Auth routes
router.post('/signup', validate(schemas.signup), signup);
router.post('/verify-otp', validate(schemas.verifyOTP), verifyOTP);
router.post('/login', validate(schemas.login), login);
router.post('/forgot-password', validate(schemas.forgotPassword), forgotPassword);
router.post('/reset-password', validate(schemas.resetPassword), resetPassword);
router.get('/me', protect, getProfile);

// Settings routes (protected)
router.put('/profile', protect, validate(schemas.updateProfile), updateProfile);
router.put('/change-password', protect, validate(schemas.resetUserPassword), resetUserPassword);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;