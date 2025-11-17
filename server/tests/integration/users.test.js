// users.test.js - Simplify for now
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');

describe('User API Integration Tests', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('GET /api/users/profile', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .get('/api/users/profile');

      expect(res.status).toBe(401);
    });
  });
});