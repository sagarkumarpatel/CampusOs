import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { createTestUser, generateToken } from './utils/auth';

describe('DSA API', () => {
  let token: string;

  beforeAll(async () => {
    const { user } = await createTestUser();
    token = generateToken(user.id);
  });

  it('should return 401 Unauthorized if no token is provided', async () => {
    const response = await request(app).get('/api/v1/dsa/categories');
    expect(response.status).toBe(401);
  });

  it('should fetch categories successfully with token', async () => {
    const response = await request(app)
      .get('/api/v1/dsa/categories')
      .set('Authorization', `Bearer ${token}`);

    console.log("DSA Categories Response:", response.status, response.body);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
