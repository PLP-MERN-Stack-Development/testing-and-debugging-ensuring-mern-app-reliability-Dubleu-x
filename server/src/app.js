// server/src/app.js - Beautiful HTML interface with existing routes
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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

// Helper function to serve HTML responses
const sendHTMLResponse = (res, title, content) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - MERN Testing Server</title>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }

          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
          }

          .container {
              background: white;
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
              padding: 40px;
              max-width: 900px;
              width: 100%;
          }

          .header {
              text-align: center;
              margin-bottom: 30px;
          }

          .logo {
              font-size: 3rem;
              margin-bottom: 15px;
          }

          h1 {
              color: #333;
              margin-bottom: 10px;
              font-size: 2.2rem;
          }

          .subtitle {
              color: #666;
              font-size: 1.1rem;
          }

          .content {
              background: #f8f9fa;
              border-radius: 15px;
              padding: 25px;
              margin: 20px 0;
          }

          .routes-section {
              margin: 25px 0;
          }

          .route-item {
              background: white;
              padding: 15px;
              margin: 10px 0;
              border-radius: 10px;
              border-left: 4px solid #007bff;
              display: flex;
              align-items: center;
          }

          .method {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 6px;
              font-weight: bold;
              font-size: 0.8rem;
              margin-right: 15px;
              min-width: 70px;
              text-align: center;
          }

          .get { background: #28a745; color: white; }
          .post { background: #007bff; color: white; }
          .put { background: #ffc107; color: black; }
          .delete { background: #dc3545; color: white; }

          .btn {
              display: inline-block;
              padding: 12px 25px;
              background: linear-gradient(135deg, #667eea, #764ba2);
              color: white;
              text-decoration: none;
              border-radius: 25px;
              margin: 10px 5px;
              transition: transform 0.3s;
              font-weight: bold;
              border: none;
              cursor: pointer;
          }

          .btn:hover {
              transform: translateY(-2px);
          }

          .json-toggle {
              background: #6c757d;
              margin-left: 10px;
          }

          .json-view {
              background: #2d3748;
              color: #e2e8f0;
              padding: 15px;
              border-radius: 8px;
              margin-top: 15px;
              font-family: 'Courier New', monospace;
              font-size: 0.9rem;
              display: none;
          }

          .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 0.9rem;
          }

          .status-badge {
              display: inline-block;
              padding: 4px 12px;
              background: #28a745;
              color: white;
              border-radius: 20px;
              font-size: 0.8rem;
              margin-left: 10px;
          }

          @media (max-width: 768px) {
              .container {
                  padding: 20px;
              }
              
              h1 {
                  font-size: 1.8rem;
              }
              
              .route-item {
                  flex-direction: column;
                  align-items: flex-start;
              }
              
              .method {
                  margin-bottom: 8px;
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <div class="logo">🚀</div>
              <h1>${title}</h1>
              <p class="subtitle">MERN Testing Server - Comprehensive Testing Environment</p>
          </div>
          
          <div class="content">
              ${content}
          </div>

          <div class="footer">
              <p>MERN Stack Testing Assignment | Express.js Server</p>
              <p>Testing Suite: Jest, Supertest, React Testing Library</p>
          </div>
      </div>

      <script>
          function toggleJSON(button) {
              const jsonView = button.parentElement.querySelector('.json-view');
              if (jsonView.style.display === 'none') {
                  jsonView.style.display = 'block';
                  button.textContent = '📋 Hide JSON';
              } else {
                  jsonView.style.display = 'none';
                  button.textContent = '📋 View JSON';
              }
          }

          function copyToClipboard(text) {
              navigator.clipboard.writeText(text).then(() => {
                  alert('JSON copied to clipboard!');
              });
          }
      </script>
  </body>
  </html>
  `;
  
  res.send(html);
};

// Basic health check route - Now with beautiful HTML
app.get('/', (req, res) => {
  trackRoute('GET', '/');
  
  if (req.accepts('html')) {
    const routesList = registeredRoutes.map(route => `
      <div class="route-item">
        <span class="method ${route.method.toLowerCase()}">${route.method}</span>
        <strong>${route.path}</strong>
        ${route.method === 'GET' && route.path === '/' ? '<span class="status-badge">Active</span>' : ''}
      </div>
    `).join('');

    const content = `
      <div class="status-badge" style="background: #28a745;">Server Running</div>
      <p style="margin: 15px 0;">Welcome to the MERN Testing Server! This server demonstrates comprehensive testing strategies for MERN stack applications.</p>
      
      <div class="routes-section">
        <h3>📡 Available Routes</h3>
        ${routesList}
      </div>

      <div style="text-align: center; margin-top: 25px;">
        <button class="btn" onclick="toggleJSON(this)">📋 View JSON Response</button>
        <a href="/api/test" class="btn">🧪 Test API</a>
        <a href="/api/posts" class="btn">📝 View Posts</a>
      </div>

      <div class="json-view">
        <pre>${JSON.stringify({
          message: 'MERN Testing Server is running!',
          timestamp: new Date().toISOString(),
          status: 'active',
          availableRoutes: registeredRoutes
        }, null, 2)}</pre>
        <button class="btn" style="background: #495057; padding: 8px 15px; font-size: 0.8rem;" 
                onclick="copyToClipboard(JSON.stringify(${JSON.stringify({
                  message: 'MERN Testing Server is running!',
                  timestamp: new Date().toISOString(),
                  status: 'active',
                  availableRoutes: registeredRoutes
                }, null, 2)}))">
          📋 Copy JSON
        </button>
      </div>
    `;
    
    sendHTMLResponse(res, 'Server Status', content);
  } else {
    res.json({ 
      message: 'MERN Testing Server is running!',
      timestamp: new Date().toISOString(),
      status: 'active',
      availableRoutes: registeredRoutes
    });
  }
});

// Test route - Enhanced with HTML
app.get('/api/test', (req, res) => {
  trackRoute('GET', '/api/test');
  
  if (req.accepts('html')) {
    const content = `
      <div style="text-align: center;">
        <div style="font-size: 4rem; margin-bottom: 20px;">✅</div>
        <h2 style="color: #28a745;">API Test Successful!</h2>
        <p style="margin: 15px 0;">The server API is working correctly and responding to requests.</p>
        
        <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: left;">
          <h4>Request Details:</h4>
          <p><strong>Endpoint:</strong> /api/test</p>
          <p><strong>Method:</strong> GET</p>
          <p><strong>Status:</strong> <span style="color: #28a745;">200 OK</span></p>
          <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>

        <button class="btn" onclick="toggleJSON(this)">📋 View JSON Response</button>
        <a href="/" class="btn">🏠 Home</a>
        <a href="/api/posts" class="btn">📝 Posts API</a>
      </div>

      <div class="json-view">
        <pre>${JSON.stringify({
          message: 'API is working!',
          environment: process.env.NODE_ENV || 'development',
          timestamp: new Date().toISOString()
        }, null, 2)}</pre>
        <button class="btn" style="background: #495057; padding: 8px 15px; font-size: 0.8rem;" 
                onclick="copyToClipboard(JSON.stringify(${JSON.stringify({
                  message: 'API is working!',
                  environment: process.env.NODE_ENV || 'development',
                  timestamp: new Date().toISOString()
                }, null, 2)}))">
          📋 Copy JSON
        </button>
      </div>
    `;
    
    sendHTMLResponse(res, 'API Test', content);
  } else {
    res.json({ 
      message: 'API is working!',
      environment: process.env.NODE_ENV || 'development'
    });
  }
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
  
  // Create basic mock routes for testing - Enhanced with HTML
  app.get('/api/posts', (req, res) => {
    trackRoute('GET', '/api/posts');
    
    const mockPosts = [
      {
        _id: '1',
        title: 'Welcome to MERN Testing',
        content: 'This is a demonstration of comprehensive testing strategies for MERN stack applications.',
        author: 'System',
        likes: 5,
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        title: 'Testing Best Practices',
        content: 'Learn how to write effective unit tests, integration tests, and debugging strategies.',
        author: 'Admin',
        likes: 3,
        createdAt: new Date().toISOString()
      }
    ];
    
    if (req.accepts('html')) {
      const postsHTML = mockPosts.map(post => `
        <div style="background: white; padding: 20px; margin: 15px 0; border-radius: 10px; border-left: 4px solid #007bff;">
          <h3 style="margin: 0 0 10px 0; color: #333;">${post.title}</h3>
          <p style="margin: 0 0 10px 0; color: #666;">${post.content}</p>
          <div style="font-size: 0.9rem; color: #888;">
            👤 By ${post.author} • ❤️ ${post.likes} likes • 📅 ${new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      `).join('');
      
      const content = `
        <h2>📝 Blog Posts</h2>
        <p style="margin: 15px 0;">Sample posts from the testing API:</p>
        
        ${postsHTML}
        
        <div style="text-align: center; margin-top: 25px;">
          <button class="btn" onclick="toggleJSON(this)">📋 View JSON Response</button>
          <a href="/" class="btn">🏠 Home</a>
          <a href="/api/test" class="btn">🧪 Test API</a>
        </div>

        <div class="json-view">
          <pre>${JSON.stringify(mockPosts, null, 2)}</pre>
          <button class="btn" style="background: #495057; padding: 8px 15px; font-size: 0.8rem;" 
                  onclick="copyToClipboard(JSON.stringify(${JSON.stringify(mockPosts, null, 2)}))">
            📋 Copy JSON
          </button>
        </div>
      `;
      
      sendHTMLResponse(res, 'Blog Posts', content);
    } else {
      res.json(mockPosts);
    }
  });
  
  app.get('/api/posts/:id', (req, res) => {
    trackRoute('GET', '/api/posts/:id');
    
    const mockPost = {
      _id: req.params.id,
      title: 'Test Post',
      content: 'This is a test post content demonstrating API functionality.',
      author: 'testuser',
      likes: 5,
      createdAt: new Date().toISOString()
    };
    
    if (req.accepts('html')) {
      const content = `
        <h2>📄 Post Details</h2>
        <div style="background: white; padding: 25px; border-radius: 10px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #333;">${mockPost.title}</h3>
          <p style="margin: 0 0 15px 0; color: #666; line-height: 1.6;">${mockPost.content}</p>
          <div style="font-size: 0.9rem; color: #888;">
            👤 By ${mockPost.author} • ❤️ ${mockPost.likes} likes • 📅 ${new Date(mockPost.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        <div style="text-align: center;">
          <button class="btn" onclick="toggleJSON(this)">📋 View JSON Response</button>
          <a href="/api/posts" class="btn">📝 All Posts</a>
          <a href="/" class="btn">🏠 Home</a>
        </div>

        <div class="json-view">
          <pre>${JSON.stringify(mockPost, null, 2)}</pre>
          <button class="btn" style="background: #495057; padding: 8px 15px; font-size: 0.8rem;" 
                  onclick="copyToClipboard(JSON.stringify(${JSON.stringify(mockPost, null, 2)}))">
            📋 Copy JSON
          </button>
        </div>
      `;
      
      sendHTMLResponse(res, 'Post Details', content);
    } else {
      res.json(mockPost);
    }
  });
  
  app.get('/api/users/profile', (req, res) => {
    trackRoute('GET', '/api/users/profile');
    
    if (req.accepts('html')) {
      const content = `
        <div style="text-align: center;">
          <div style="font-size: 4rem; margin-bottom: 20px;">🔒</div>
          <h2 style="color: #dc3545;">Authentication Required</h2>
          <p style="margin: 15px 0;">This endpoint requires user authentication. Please provide valid credentials to access user profile data.</p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Status:</strong> 401 Unauthorized<br>
            <strong>Message:</strong> Authentication required
          </div>

          <button class="btn" onclick="toggleJSON(this)">📋 View JSON Response</button>
          <a href="/" class="btn">🏠 Home</a>
          <a href="/api/test" class="btn">🧪 Test API</a>
        </div>

        <div class="json-view">
          <pre>${JSON.stringify({ error: 'Authentication required' }, null, 2)}</pre>
          <button class="btn" style="background: #495057; padding: 8px 15px; font-size: 0.8rem;" 
                  onclick="copyToClipboard(JSON.stringify(${JSON.stringify({ error: 'Authentication required' }, null, 2)}))">
            📋 Copy JSON
          </button>
        </div>
      `;
      
      sendHTMLResponse(res, 'Authentication Required', content);
    } else {
      res.status(401).json({ error: 'Authentication required' });
    }
  });
}

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  
  if (req.accepts('html')) {
    const content = `
      <div style="text-align: center;">
        <div style="font-size: 4rem; margin-bottom: 20px;">💥</div>
        <h2 style="color: #dc3545;">Server Error</h2>
        <p style="margin: 15px 0;">Something went wrong on the server. Please try again later.</p>
        
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <strong>Error:</strong> ${err.message}<br>
          <strong>Status:</strong> 500 Internal Server Error
        </div>

        <a href="/" class="btn">🏠 Go Home</a>
        <a href="/api/test" class="btn">🧪 Test API</a>
      </div>
    `;
    
    sendHTMLResponse(res, 'Server Error', content);
  } else {
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Enhanced 404 handler - Show available routes
app.use('*', (req, res) => {
  if (req.accepts('html')) {
    const routesList = registeredRoutes.map(route => `
      <div class="route-item">
        <span class="method ${route.method.toLowerCase()}">${route.method}</span>
        <strong>${route.path}</strong>
      </div>
    `).join('');

    const content = `
      <div style="text-align: center;">
        <div style="font-size: 4rem; margin-bottom: 20px;">❌</div>
        <h2 style="color: #dc3545;">404 - Page Not Found</h2>
        <p style="margin: 15px 0;">The requested URL <code style="background: #e9ecef; padding: 2px 6px; border-radius: 4px;">${req.originalUrl}</code> was not found on this server.</p>
        
        <div class="routes-section">
          <h3>📡 Available Routes</h3>
          ${routesList}
        </div>

        <div style="text-align: center; margin-top: 25px;">
          <a href="/" class="btn">🏠 Go Home</a>
          <a href="/api/test" class="btn">🧪 Test API</a>
        </div>
      </div>
    `;
    
    sendHTMLResponse(res, '404 - Not Found', content);
  } else {
    res.status(404).json({ 
      error: 'Route not found',
      requested: req.originalUrl,
      availableRoutes: registeredRoutes
    });
  }
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
    console.log('✨ Now serving beautiful HTML pages!');
    console.log('📋 Available routes:');
    registeredRoutes.forEach(route => {
      console.log(`   ${route.method} ${route.path}`);
    });
    console.log('────────────────────────────────────────────────');
  });
}

module.exports = app;