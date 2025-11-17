// client/src/services/api.js - Simple API service mocks
export const deletePost = jest.fn().mockResolvedValue({ success: true });
export const likePost = jest.fn().mockResolvedValue({ success: true });
export const createPost = jest.fn().mockResolvedValue({ success: true });
export const updatePost = jest.fn().mockResolvedValue({ success: true });
export const getPosts = jest.fn().mockResolvedValue({ posts: [] });
export const getPost = jest.fn().mockResolvedValue({ post: {} });