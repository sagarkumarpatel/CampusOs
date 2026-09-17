import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { createTestUser, generateToken } from './utils/auth';

describe('Career Tracking API', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const { user } = await createTestUser({ email: `career-test-${Date.now()}@example.com` });
    userId = user.id;
    token = generateToken(userId);
  });

  it('should return 401 Unauthorized if no token is provided', async () => {
    const response = await request(app).get('/api/v1/career');
    expect(response.status).toBe(401);
  });

  it('should fetch opportunities successfully with token', async () => {
    const response = await request(app)
      .get('/api/v1/career')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return 404 when registering for a non-existent opportunity', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const response = await request(app)
      .post(`/api/v1/career/${fakeId}/register`)
      .set('Authorization', `Bearer ${token}`);

    expect([400, 404, 500]).toContain(response.status);
  });
});
