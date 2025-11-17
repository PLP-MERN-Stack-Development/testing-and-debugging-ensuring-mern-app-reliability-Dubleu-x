// authMiddleware.test.js - Fix the mock
const { auth, optionalAuth } = require('../../src/middleware/auth');
const { generateToken } = require('../../src/utils/auth');

// Mock the User model properly
const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  username: 'testuser',
  email: 'test@example.com',
};

jest.mock('../../src/models/User', () => ({
  findById: jest.fn().mockImplementation(() => ({
    select: jest.fn().mockResolvedValue(mockUser)
  }))
}));

describe('Auth Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      header: jest.fn(),
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('auth middleware', () => {
    it('should call next() with valid token', async () => {
      const user = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        email: 'test@example.com',
      };
      
      const token = generateToken(user);
      mockReq.header.mockReturnValue(`Bearer ${token}`);

      await auth(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    }, 10000);

    it('should return 401 with invalid token', async () => {
      mockReq.header.mockReturnValue('Bearer invalid-token');

      await auth(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    }, 10000);

    it('should return 401 when no token provided', async () => {
      mockReq.header.mockReturnValue(null);

      await auth(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    }, 10000);
  });

  describe('optionalAuth middleware', () => {
    it('should set req.user with valid token', async () => {
      const user = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        email: 'test@example.com',
      };
      
      const token = generateToken(user);
      mockReq.header.mockReturnValue(`Bearer ${token}`);

      await optionalAuth(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    }, 10000);

    it('should not set req.user with invalid token but still call next', async () => {
      mockReq.header.mockReturnValue('Bearer invalid-token');

      await optionalAuth(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    }, 10000);
  });
});