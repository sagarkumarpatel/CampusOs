import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { createTestUser, generateToken } from './utils/auth';

describe('Academic Resources API', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const { user } = await createTestUser({ email: `resources-test-${Date.now()}@example.com` });
    userId = user.id;
    token = generateToken(userId);
  });

  it('should return 401 Unauthorized if no token is provided', async () => {
    const response = await request(app).get('/api/v1/resources');
    expect(response.status).toBe(401);
  });

  it('should fetch shared resources successfully with token', async () => {
    const response = await request(app)
      .get('/api/v1/resources')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('subjectNotes');
    expect(response.body).toHaveProperty('previousYearQuestions');
    expect(response.body).toHaveProperty('interviewNotes');
    expect(response.body).toHaveProperty('cheatSheets');
  });
});
