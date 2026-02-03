const noteService = require('../../src/services/note.service');
const Note = require('../../src/models/Note');

jest.mock('../../src/models/Note', () => ({
  create: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
}));

describe('NoteService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createNote returns public json', async () => {
    Note.create.mockResolvedValue({ toPublicJSON: () => ({ id: 'n1' }) });
    const result = await noteService.createNote('u1', { title: 't', content: 'c' });
    expect(result).toEqual({ id: 'n1' });
  });

  test('getNoteById rejects missing note', async () => {
    Note.findById.mockResolvedValue(null);
    await expect(noteService.getNoteById('n1', 'u1')).rejects.toMatchObject({ statusCode: 404 });
  });

  test('getNoteById rejects access to other user for non-admin', async () => {
    Note.findById.mockResolvedValue({
      isOwnedBy: () => false,
    });
    await expect(noteService.getNoteById('n1', 'u2', 'USER')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  test('getUserNotes returns paginated result', async () => {
    const note = { toPublicJSON: () => ({ id: 'n1' }) };
    const sort = jest.fn().mockResolvedValue([note]);
    const limit = jest.fn().mockReturnValue({ sort });
    const skip = jest.fn().mockReturnValue({ limit });

    Note.find.mockReturnValue({ skip });
    Note.countDocuments.mockResolvedValue(1);

    const result = await noteService.getUserNotes('u1', {}, { page: 1, limit: 10 });
    expect(result.notes).toEqual([{ id: 'n1' }]);
  });
});
