const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/rbac.middleware');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');

const router = express.Router();

const updateProfileValidation = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
];

router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfileValidation), userController.updateProfile);
router.delete('/profile', userController.deleteAccount);

router.get('/', requireAdmin, userController.getAllUsers);
router.get('/:id', requireAdmin, userController.getUserById);

module.exports = router;
