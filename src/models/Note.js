const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [1, 'Title must be at least 1 character'],
            maxlength: [200, 'Title must not exceed 200 characters'],
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
            trim: true,
            minlength: [1, 'Content must be at least 1 character'],
            maxlength: [5000, 'Content must not exceed 5000 characters'],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true,
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

noteSchema.index({ userId: 1, createdAt: -1 });

noteSchema.methods.isOwnedBy = function (userId) {
    return this.userId.toString() === userId.toString();
};

noteSchema.methods.toPublicJSON = function () {
    return {
        id: this._id,
        title: this.title,
        content: this.content,
        userId: this.userId,
        isArchived: this.isArchived,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
