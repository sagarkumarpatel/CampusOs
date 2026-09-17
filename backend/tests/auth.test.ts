import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { createTestUser } from './utils/auth';

describe('Auth API', () => {
  const loginCredentials = {
    email: `auth-test-${Date.now()}@example.com`,
    password: 'Password123!',
  };

  beforeAll(async () => {
    await createTestUser(loginCredentials);
  });

  it('should successfully login and return JWT tokens', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(loginCredentials);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(loginCredentials.email);
    expect(response.body).toHaveProperty('accessToken');
    
    // Check cookies for tokens
    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some((c: string) => c.startsWith('refreshToken='))).toBe(true);
  });

  it('should fail login with wrong password', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: loginCredentials.email,
        password: 'WrongPassword123!',
      });

    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty('error');
  });

  it('should fail validation with invalid email format', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'invalid-email',
        password: 'Password123!',
      });

    expect(response.status).toBe(400);
    console.log("Validation error body:", response.body);
    expect(response.body).toHaveProperty('error');
  });
});
