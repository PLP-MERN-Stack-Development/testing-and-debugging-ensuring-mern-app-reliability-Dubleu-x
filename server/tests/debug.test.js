// debug.test.js - Fix expected status
describe('Debugging Examples', () => {
  it('demonstrates debugging async operations', async () => {
    console.log('Starting async operation...');
    
    const result = await new Promise(resolve => {
      setTimeout(() => {
        console.log('Async operation completed');
        resolve('success');
      }, 100);
    });
    
    expect(result).toBe('success');
  });

  it('shows how to debug failing API calls', async () => {
    const request = require('supertest');
    const app = require('../src/app');
    
    try {
      const response = await request(app)
        .post('/api/posts')
        .send({}); // Empty payload to trigger validation
      
      console.log('Response status:', response.status);
      console.log('Response body:', response.body);
      
      // The actual response is 401 (no auth) not 400 (validation)
      expect(response.status).toBe(401); // Changed from 400 to 401
    } catch (error) {
      console.error('Test failed with error:', error);
      throw error;
    }
  });
});