const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        index: true,
    },
    otp: {
        type: String,
        required: [true, 'OTP is required'],
        length: 6,
    },
    type: {
        type: String,
        enum: ['signup', 'forgot_password', 'email_verification'],
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    attempts: {
        type: Number,
        default: 0,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for cleanup
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to verify OTP
otpSchema.methods.verifyOTP = function (inputOTP) {
    if (this.isUsed) {
        return { valid: false, message: 'OTP has already been used' };
    }

    if (this.expiresAt < new Date()) {
        return { valid: false, message: 'OTP has expired' };
    }

    if (this.attempts >= 5) {
        return { valid: false, message: 'Too many failed attempts' };
    }

    if (this.otp !== inputOTP) {
        this.attempts += 1;
        this.save();
        return { valid: false, message: 'Invalid OTP' };
    }

    this.isUsed = true;
    this.save();
    return { valid: true, message: 'OTP verified successfully' };
};

// Static method to create OTP
otpSchema.statics.createOTP = function (email, type) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return this.create({
        email,
        otp,
        type,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });
};

// Static method to cleanup expired OTPs
otpSchema.statics.cleanupExpired = function () {
    return this.deleteMany({
        $or: [
            { expiresAt: { $lt: new Date() } },
            { isUsed: true, createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } // Delete used OTPs older than 24 hours
        ]
    });
};

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
