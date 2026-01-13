const Note = require('../models/Note');
const ApiError = require('../utils/ApiError');

class NoteService {
    async createNote(userId, noteData) {
        const note = await Note.create({
            ...noteData,
            userId,
        });

        return note.toPublicJSON();
    }

    async getNoteById(noteId, userId, userRole = 'USER') {
        const note = await Note.findById(noteId);

        if (!note) {
            throw ApiError.notFound('Note not found');
        }

        if (userRole !== 'ADMIN' && !note.isOwnedBy(userId)) {
            throw ApiError.notFound('Note not found');
        }

        return note.toPublicJSON();
    }

    async getUserNotes(userId, filters = {}, pagination = {}) {
        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        const query = { userId };

        if (filters.isArchived !== undefined) {
            query.isArchived = filters.isArchived;
        }

        if (filters.search) {
            query.$or = [
                { title: { $regex: filters.search, $options: 'i' } },
                { content: { $regex: filters.search, $options: 'i' } },
            ];
        }

        const [notes, total] = await Promise.all([
            Note.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Note.countDocuments(query),
        ]);

        return {
            notes: notes.map((note) => note.toPublicJSON()),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async updateNote(noteId, userId, updateData, userRole = 'USER') {
        const note = await Note.findById(noteId);

        if (!note) {
            throw ApiError.notFound('Note not found');
        }

        if (userRole !== 'ADMIN' && !note.isOwnedBy(userId)) {
            throw ApiError.notFound('Note not found');
        }

        delete updateData.userId;

        Object.assign(note, updateData);
        await note.save();

        return note.toPublicJSON();
    }

    async deleteNote(noteId, userId, userRole = 'USER') {
        const note = await Note.findById(noteId);

        if (!note) {
            throw ApiError.notFound('Note not found');
        }

        if (userRole !== 'ADMIN' && !note.isOwnedBy(userId)) {
            throw ApiError.notFound('Note not found');
        }

        await note.deleteOne();

        return true;
    }

    async getAllNotes(filters = {}, pagination = {}) {
        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        const query = {};

        if (filters.userId) {
            query.userId = filters.userId;
        }

        if (filters.isArchived !== undefined) {
            query.isArchived = filters.isArchived;
        }

        const [notes, total] = await Promise.all([
            Note.find(query)
                .populate('userId', 'username email')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Note.countDocuments(query),
        ]);

        return {
            notes: notes.map((note) => note.toPublicJSON()),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}

module.exports = new NoteService();
