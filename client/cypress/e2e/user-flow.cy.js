// client/cypress/e2e/user-flow.cy.js
describe('User Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should allow user to register, login, create and delete posts', () => {
    const timestamp = Date.now();
    const testUser = `testuser${timestamp}`;
    const testEmail = `test${timestamp}@example.com`;
    
    // Register
    cy.contains('Register').click();
    cy.get('input[name="username"]').type(testUser);
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Should be redirected to login
    cy.url().should('include', '/login');
    
    // Login
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Should be logged in and see dashboard
    cy.url().should('include', '/dashboard');
    cy.contains(`Welcome, ${testUser}`);

    // Create a post
    cy.contains('Create Post').click();
    cy.get('input[name="title"]').type('My First Test Post');
    cy.get('textarea[name="content"]').type('This is the content of my test post');
    cy.get('select[name="category"]').select('Technology');
    cy.contains('Publish Post').click();

    // Should see the new post
    cy.contains('My First Test Post');
    cy.contains('This is the content of my test post');

    // Delete the post
    cy.contains('My First Test Post').click();
    cy.contains('Delete').click();
    cy.contains('Yes, Delete').click();

    // Post should be removed
    cy.contains('My First Test Post').should('not.exist');
  });
});