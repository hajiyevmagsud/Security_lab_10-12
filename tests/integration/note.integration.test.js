const request = require('supertest');
const app = require('../../src/app');
const { connect, clear, close } = require('../testUtils/mongoMemory');

describe('Notes integration', () => {
  beforeAll(connect);
  afterEach(clear);
  afterAll(close);

  const registerAndGetCookies = async (email, username) => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email,
        username,
        password: 'Str0ng!Pass1',
      });

    expect(registerRes.status).toBe(201);
    const cookies = registerRes.headers['set-cookie'];
    expect(cookies).toBeDefined();
    return cookies;
  };

  test('prevents users from accessing other users notes', async () => {
    const user1Cookies = await registerAndGetCookies('usera@example.com', 'usera');
    const user2Cookies = await registerAndGetCookies('userb@example.com', 'userb');

    const createRes = await request(app)
      .post('/api/notes')
      .set('Cookie', user1Cookies)
      .send({ title: 'Note', content: 'Secret' });

    expect(createRes.status).toBe(201);
    const noteId = createRes.body.data.id;

    const forbiddenRes = await request(app)
      .get(`/api/notes/${noteId}`)
      .set('Cookie', user2Cookies);

    expect(forbiddenRes.status).toBe(404);
  });

  test('rejects unauthenticated access to notes', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.status).toBe(401);
  });
});
