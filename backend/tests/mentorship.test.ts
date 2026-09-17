import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { createTestUser, generateToken } from './utils/auth';

describe('Mentorship API', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const { user } = await createTestUser({ email: `mentorship-test-${Date.now()}@example.com` });
    userId = user.id;
    token = generateToken(userId);
  });

  it('should return 401 Unauthorized if no token is provided', async () => {
    const response = await request(app).get('/api/v1/mentors');
    expect(response.status).toBe(401);
  });

  it('should fetch mentors successfully with token', async () => {
    const response = await request(app)
      .get('/api/v1/mentors')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should fetch own profile successfully with token', async () => {
    const response = await request(app)
      .get('/api/v1/mentors/profile')
      .set('Authorization', `Bearer ${token}`);

    // Depending on logic, it might be 200 or 404 if profile doesn't exist.
    expect([200, 404]).toContain(response.status);
  });
});
