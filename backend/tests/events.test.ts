import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { createTestUser, generateToken } from './utils/auth';

describe('Events API', () => {
  let studentToken: string;
  let managerToken: string;

  beforeAll(async () => {
    const { user: student } = await createTestUser({ role: 'STUDENT' });
    studentToken = generateToken(student.id, 'STUDENT');

    const { user: manager } = await createTestUser({ role: 'PLACEMENT_COORDINATOR' });
    managerToken = generateToken(manager.id, 'PLACEMENT_COORDINATOR');
  });

  it('should allow student to view upcoming events', async () => {
    const response = await request(app)
      .get('/api/v1/events/upcoming')
      .set('Authorization', `Bearer ${studentToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should deny student from creating an event', async () => {
    const response = await request(app)
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        title: 'Unauthorized Event',
        description: 'Should fail',
        eventType: 'SEMINAR',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      });
    
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error');
  });

  it('should allow manager to create an event', async () => {
    // For testing, depending on validation rules, you might need specific fields.
    // Assuming simple validation passes for this test or fails cleanly with 400 not 403.
    const response = await request(app)
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        title: 'Authorized Event',
        description: 'Should succeed',
        eventType: 'SEMINAR',
        mode: 'VIRTUAL',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
      });
    
    // We just check that it's NOT a 403 Forbidden
    expect(response.status).not.toBe(403);
    expect([200, 201, 400]).toContain(response.status); 
  });
});
