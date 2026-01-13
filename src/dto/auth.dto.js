const { body } = require('express-validator');
const { isStrongPassword, isAlphanumericWithUnderscore } = require('../validators/custom.validators');
const { validatePassword } = require('../validators/password.validator');

const registerValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .custom(isAlphanumericWithUnderscore)
        .withMessage('Username can only contain letters, numbers, and underscores'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .custom(validatePassword),
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

module.exports = {
    registerValidation,
    loginValidation,
};
