// server/src/app.js - Enhanced with route logging
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Store all registered routes for debugging
const registeredRoutes = [];

// Helper to track routes
const trackRoute = (method, path) => {
  registeredRoutes.push({ method, path });
};

// Basic health check route
app.get('/', (req, res) => {
  trackRoute('GET', '/');
  res.json({ 
    message: 'MERN Testing Server is running!',
    timestamp: new Date().toISOString(),
    status: 'active',
    availableRoutes: registeredRoutes
  });
});

// Test route
app.get('/api/test', (req, res) => {
  trackRoute('GET', '/api/test');
  res.json({ 
    message: 'API is working!',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Try to load API routes
try {
  const postRoutes = require('./routes/postRoutes');
  const userRoutes = require('./routes/userRoutes');
  
  app.use('/api/posts', postRoutes);
  app.use('/api/users', userRoutes);
  console.log('✅ API routes loaded successfully');
  
  // Track the API routes
  trackRoute('GET', '/api/posts');
  trackRoute('POST', '/api/posts');
  trackRoute('GET', '/api/posts/:id');
  trackRoute('PUT', '/api/posts/:id');
  trackRoute('DELETE', '/api/posts/:id');
  trackRoute('GET', '/api/users/profile');
  trackRoute('PUT', '/api/users/profile');
  
} catch (error) {
  console.log('⚠️  API routes not loaded:', error.message);
  console.log('💡 Creating basic API routes for testing...');
  
  // Create basic mock routes for testing
  app.get('/api/posts', (req, res) => {
    trackRoute('GET', '/api/posts');
    res.json([
      {
        _id: '1',
        title: 'Test Post 1',
        content: 'This is a test post',
        author: 'testuser',
        likes: 5
      }
    ]);
  });
  
  app.get('/api/posts/:id', (req, res) => {
    trackRoute('GET', '/api/posts/:id');
    res.json({
      _id: req.params.id,
      title: 'Test Post',
      content: 'This is a test post content',
      author: 'testuser',
      likes: 5,
      createdAt: new Date().toISOString()
    });
  });
  
  app.get('/api/users/profile', (req, res) => {
    trackRoute('GET', '/api/users/profile');
    res.status(401).json({ error: 'Authentication required' });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler - Show available routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    requested: req.originalUrl,
    availableRoutes: registeredRoutes
  });
});

const PORT = process.env.PORT || 5000;

console.log('🚀 Starting MERN Testing Server...');

// Try to connect to MongoDB (optional)
mongoose.connect('mongodb://localhost:27017/mern_testing', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  startServer();
})
.catch(err => {
  console.log('⚠️  MongoDB connection failed, starting server without DB...');
  startServer();
});

function startServer() {
  app.listen(PORT, () => {
    console.log(`🎉 Server is running on http://localhost:${PORT}`);
    console.log('📋 Available routes:');
    registeredRoutes.forEach(route => {
      console.log(`   ${route.method} ${route.path}`);
    });
    console.log('────────────────────────────────────────────────');
  });
}

module.exports = app;