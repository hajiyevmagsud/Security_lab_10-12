const ApiError = require('../../src/utils/ApiError');
const userService = require('../../src/services/user.service');
const User = require('../../src/models/User');

jest.mock('../../src/models/User', () => ({
  findById: jest.fn(),
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
}));

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getUserById throws notFound when missing', async () => {
    User.findById.mockResolvedValue(null);

    await expect(userService.getUserById('missing')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  test('getUserById returns public json', async () => {
    const user = { toPublicJSON: () => ({ id: '1', username: 'user' }) };
    User.findById.mockResolvedValue(user);

    const result = await userService.getUserById('1');
    expect(result).toEqual({ id: '1', username: 'user' });
  });

  test('updateUser rejects duplicate username', async () => {
    User.findOne.mockResolvedValue({ id: 'existing' });

    await expect(
      userService.updateUser('1', { username: 'taken' })
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  test('updateUser throws notFound when missing', async () => {
    User.findOne.mockResolvedValue(null);
    User.findByIdAndUpdate.mockResolvedValue(null);

    await expect(
      userService.updateUser('1', { username: 'new' })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  test('updateUser returns updated public json', async () => {
    User.findOne.mockResolvedValue(null);
    User.findByIdAndUpdate.mockResolvedValue({
      toPublicJSON: () => ({ id: '1', username: 'new' }),
    });

    const result = await userService.updateUser('1', { username: 'new' });
    expect(result).toEqual({ id: '1', username: 'new' });
  });

  test('deleteUser throws notFound when missing', async () => {
    User.findByIdAndDelete.mockResolvedValue(null);

    await expect(userService.deleteUser('1')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  test('getAllUsers returns paginated result', async () => {
    const user = { toPublicJSON: () => ({ id: '1', username: 'user' }) };
    const sort = jest.fn().mockResolvedValue([user]);
    const limit = jest.fn().mockReturnValue({ sort });
    const skip = jest.fn().mockReturnValue({ limit });
    const select = jest.fn().mockReturnValue({ skip });

    User.find.mockReturnValue({ select });
    User.countDocuments.mockResolvedValue(1);

    const result = await userService.getAllUsers({}, { page: 1, limit: 10 });

    expect(result.users).toEqual([{ id: '1', username: 'user' }]);
    expect(result.pagination.total).toBe(1);
  });
});
