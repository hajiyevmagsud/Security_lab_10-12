const express = require('express');
const noteController = require('../controllers/note.controller');
const { createNoteValidation, updateNoteValidation } = require('../dto/note.dto');
const { validate } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/rbac.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/admin/all', requireRole('ADMIN'), noteController.getAllNotes);

router.post('/', validate(createNoteValidation), noteController.createNote);
router.get('/', noteController.getUserNotes);
router.get('/:id', noteController.getNoteById);
router.put('/:id', validate(updateNoteValidation), noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;
