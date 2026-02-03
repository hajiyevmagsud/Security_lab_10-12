const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const User = require('../../src/models/User');
const { connect, clear, close } = require('../testUtils/mongoMemory');

describe('Auth integration', () => {
  beforeAll(connect);
  afterEach(clear);
  afterAll(close);

  test('registers and accesses protected profile', async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'user1@example.com',
        username: 'user1',
        password: 'Str0ng!Pass1',
      });

    expect(registerRes.status).toBe(201);
    expect(registerRes.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('jwt=')])
    );

    const cookies = registerRes.headers['set-cookie'];

    const profileRes = await request(app)
      .get('/api/users/profile')
      .set('Cookie', cookies);

    expect(profileRes.status).toBe(200);
    expect(profileRes.body.data.username).toBe('user1');
  });

  test('rejects login with wrong password', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'user2@example.com',
        username: 'user2',
        password: 'Str0ng!Pass1',
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user2@example.com', password: 'WrongPass1!' });

    expect(loginRes.status).toBe(401);
  });

  test('rejects invalid registration input', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'bad-email',
        username: 'ab',
        password: 'weakpass',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });

  test('rejects access without authentication', async () => {
    const res = await request(app).get('/api/users/profile');
    expect(res.status).toBe(401);
  });

  test('rejects invalid token', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Cookie', ['jwt=invalid']);

    expect(res.status).toBe(401);
  });

  test('rejects expired token', async () => {
    const user = await User.create({
      email: 'exp@example.com',
      username: 'expuser',
      password: 'Str0ng!Pass1',
      role: 'USER',
    });

    const token = jwt.sign(
      { userId: user._id, role: 'USER' },
      process.env.JWT_SECRET,
      { expiresIn: '1ms' }
    );

    await new Promise((resolve) => setTimeout(resolve, 5));

    const res = await request(app)
      .get('/api/users/profile')
      .set('Cookie', [`jwt=${token}`]);

    expect(res.status).toBe(401);
  });
});
