const authService = require('../../src/services/auth.service');
const User = require('../../src/models/User');
const RefreshToken = require('../../src/models/RefreshToken');

jest.mock('../../src/models/User', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
}));

jest.mock('../../src/models/RefreshToken', () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  deleteOne: jest.fn(),
}));

jest.mock('../../src/config/jwt', () => ({
  jwtConfig: { refreshExpiresIn: '7d' },
  generateToken: jest.fn().mockReturnValue('access-token'),
  generateRefreshToken: jest.fn().mockReturnValue('refresh-token'),
  verifyToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
}));

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('register rejects duplicate email', async () => {
    User.findOne.mockResolvedValue({ email: 'test@example.com', username: 'user' });

    await expect(
      authService.register({ email: 'test@example.com', username: 'user2', password: 'Passw0rd!' })
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  test('login rejects missing user', async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await expect(authService.login('missing@example.com', 'Passw0rd!')).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  test('login rejects invalid password', async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(false),
      }),
    });

    await expect(authService.login('user@example.com', 'wrong')).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  test('login returns tokens for valid credentials', async () => {
    const user = {
      _id: 'user-id',
      isActive: true,
      role: 'USER',
      comparePassword: jest.fn().mockResolvedValue(true),
      toPublicJSON: () => ({ id: 'user-id' }),
    };

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(user),
    });
    RefreshToken.create.mockResolvedValue({});

    const result = await authService.login('user@example.com', 'Passw0rd!');
    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(result.user).toEqual({ id: 'user-id' });
  });

  test('verifyToken rejects invalid token', async () => {
    const { verifyToken } = require('../../src/config/jwt');
    verifyToken.mockImplementation(() => {
      throw new Error('invalid');
    });

    await expect(authService.verifyToken('bad')).rejects.toMatchObject({ statusCode: 401 });
  });
});
