import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { createTestUser, generateToken } from './utils/auth';

describe('Subject Notes API', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const { user } = await createTestUser({ email: `notes-test-${Date.now()}@example.com` });
    userId = user.id;
    token = generateToken(userId);
  });

  it('should return 401 Unauthorized if no token is provided', async () => {
    const response = await request(app).get('/api/v1/core-subject-notes');
    expect(response.status).toBe(401);
  });

  it('should fetch notes successfully with token', async () => {
    const response = await request(app)
      .get('/api/v1/core-subject-notes')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
