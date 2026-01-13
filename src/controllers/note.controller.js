const noteService = require('../services/note.service');
const ApiResponse = require('../utils/ApiResponse');
const { asyncHandler } = require('../middleware/error.middleware');

class NoteController {
    createNote = asyncHandler(async (req, res) => {
        const note = await noteService.createNote(req.user._id, req.body);

        res.status(201).json(
            ApiResponse.success(201, note, 'Note created successfully')
        );
    });

    getUserNotes = asyncHandler(async (req, res) => {
        const { page, limit, isArchived, search } = req.query;

        const filters = {};
        if (isArchived !== undefined) filters.isArchived = isArchived === 'true';
        if (search) filters.search = search;

        const result = await noteService.getUserNotes(req.user._id, filters, {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        });

        res.status(200).json(
            ApiResponse.paginated(
                200,
                result.notes,
                result.pagination,
                'Notes retrieved successfully'
            )
        );
    });

    getNoteById = asyncHandler(async (req, res) => {
        const note = await noteService.getNoteById(
            req.params.id,
            req.user._id,
            req.user.role
        );

        res.status(200).json(
            ApiResponse.success(200, note, 'Note retrieved successfully')
        );
    });

    updateNote = asyncHandler(async (req, res) => {
        const note = await noteService.updateNote(
            req.params.id,
            req.user._id,
            req.body,
            req.user.role
        );

        res.status(200).json(
            ApiResponse.success(200, note, 'Note updated successfully')
        );
    });

    deleteNote = asyncHandler(async (req, res) => {
        await noteService.deleteNote(
            req.params.id,
            req.user._id,
            req.user.role
        );

        res.status(204).send();
    });

    getAllNotes = asyncHandler(async (req, res) => {
        const { page, limit, userId, isArchived } = req.query;

        const filters = {};
        if (userId) filters.userId = userId;
        if (isArchived !== undefined) filters.isArchived = isArchived === 'true';

        const result = await noteService.getAllNotes(filters, {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        });

        res.status(200).json(
            ApiResponse.paginated(
                200,
                result.notes,
                result.pagination,
                'All notes retrieved successfully'
            )
        );
    });
}

module.exports = new NoteController();
