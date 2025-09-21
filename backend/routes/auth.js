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
const { validate, schemas } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

// Auth routes
router.post('/signup', validate(schemas.signup), signup);
router.post('/verify-otp', validate(schemas.verifyOTP), verifyOTP);
router.post('/login', validate(schemas.login), login);
router.post('/forgot-password', validate(schemas.forgotPassword), forgotPassword);
router.post('/reset-password', validate(schemas.resetPassword), resetPassword);
router.get('/me', protect, getProfile);

module.exports = router;