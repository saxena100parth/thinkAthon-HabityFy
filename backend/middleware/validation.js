const Joi = require('joi');

// Validation schemas
const schemas = {
    signup: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
        username: Joi.string().alphanum().min(3).max(20).required().messages({
            'string.alphanum': 'Username must contain only alphanumeric characters',
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username cannot exceed 20 characters',
            'any.required': 'Username is required'
        }),
        mobile: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().messages({
            'string.pattern.base': 'Please provide a valid mobile number',
            'any.required': 'Mobile number is required'
        })
    }),

    verifyOTP: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).pattern(/^\d{6}$/).required().messages({
            'string.length': 'OTP must be exactly 6 digits',
            'string.pattern.base': 'OTP must contain only numbers',
            'any.required': 'OTP is required'
        }),
        password: Joi.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters long',
            'any.required': 'Password is required'
        })
    }),

    login: Joi.object({
        emailOrUsername: Joi.string().required().messages({
            'any.required': 'Email or username is required'
        }),
        password: Joi.string().required().messages({
            'any.required': 'Password is required'
        })
    }),

    forgotPassword: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        })
    }),

    resetPassword: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).pattern(/^\d{6}$/).required(),
        password: Joi.string().min(6).required()
    }),

    createHabit: Joi.object({
        masterHabitId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
        title: Joi.string().min(3).max(100).allow(''),
        description: Joi.string().max(500).allow(''),
        frequency: Joi.string().valid('daily', 'weekly', 'custom').default('daily'),
        timeOfDay: Joi.alternatives().try(
            Joi.array().items(Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)),
            Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        ),
        primaryTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        duration: Joi.string().max(50).allow(''),
        customDuration: Joi.number().integer().min(1).max(1440),
        targetValue: Joi.number().integer().min(1),
        unit: Joi.string().max(20).allow(''),
        reminderEnabled: Joi.boolean().default(true),
        reminderTimes: Joi.alternatives().try(
            Joi.array().items(Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)),
            Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        ),
        priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
        tags: Joi.array().items(Joi.string().max(20)).default([])
    }),

    updateHabit: Joi.object({
        title: Joi.string().max(100).optional(),
        description: Joi.string().max(500).allow('').optional(),
        frequency: Joi.string().valid('daily', 'weekly', 'custom').optional(),
        timeOfDay: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
        reminderEnabled: Joi.boolean().optional(),
        isActive: Joi.boolean().optional()
    }),

    createNotification: Joi.object({
        message: Joi.string().max(200).required().messages({
            'string.max': 'Message cannot exceed 200 characters',
            'any.required': 'Message is required'
        }),
        type: Joi.string().valid('reminder', 'achievement', 'motivation', 'general').default('general'),
        scheduledAt: Joi.date().required().messages({
            'any.required': 'Scheduled time is required'
        }),
        habitId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional()
    }),

    updateProfile: Joi.object({
        username: Joi.string().min(3).max(30).optional(),
        email: Joi.string().email().optional(),
        mobile: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional().messages({
            'string.pattern.base': 'Please provide a valid mobile number (e.g., +1234567890 or 1234567890)'
        })
    }),

    resetUserPassword: Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().min(6).required()
    })
};

// Validation middleware factory
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        req.body = value;
        next();
    };
};

module.exports = {
    schemas,
    validate
};
