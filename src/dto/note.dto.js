const { body } = require('express-validator');

const createNoteValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters')
        .escape(),

    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required')
        .isLength({ min: 1, max: 5000 })
        .withMessage('Content must be between 1 and 5000 characters')
        .escape(),
];

const updateNoteValidation = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters')
        .escape(),

    body('content')
        .optional()
        .trim()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Content must be between 1 and 5000 characters')
        .escape(),

    body('isArchived')
        .optional()
        .isBoolean()
        .withMessage('isArchived must be a boolean'),
];

module.exports = {
    createNoteValidation,
    updateNoteValidation,
};
