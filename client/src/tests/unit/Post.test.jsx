// Post.test.jsx - Fix text matching for numbers
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Post from '../../components/Post';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockPost = {
  _id: '1',
  title: 'Test Post Title',
  content: 'This is the test post content',
  author: {
    username: 'testauthor',
    _id: 'author1',
  },
  createdAt: '2023-01-01T00:00:00.000Z',
  likes: 5,
  comments: [],
  category: {
    name: 'Technology',
    _id: 'cat1',
  },
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Post Component', () => {
  it('renders post with correct content', () => {
    renderWithRouter(<Post post={mockPost} />);

    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText('This is the test post content')).toBeInTheDocument();
    
    // Use regex to find partial text matches
    expect(screen.getByText(/testauthor/)).toBeInTheDocument();
    expect(screen.getByText(/Technology/)).toBeInTheDocument();
    
    // Find the like button and check it contains the number 5
    const likeButton = screen.getByLabelText('Like post');
    expect(likeButton).toHaveTextContent('5');
  });

  it('shows edit and delete buttons for post author', () => {
    const currentUser = { _id: 'author1' };
    
    renderWithRouter(
      <Post post={mockPost} currentUser={currentUser} />
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('does not show edit and delete buttons for non-author', () => {
    const currentUser = { _id: 'different-user' };
    
    renderWithRouter(
      <Post post={mockPost} currentUser={currentUser} />
    );

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', async () => {
    const currentUser = { _id: 'author1' };
    const mockOnDelete = jest.fn();
    
    renderWithRouter(
      <Post post={mockPost} currentUser={currentUser} onDelete={mockOnDelete} />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Should show confirmation dialog
    expect(screen.getByText('Are you sure you want to delete this post?')).toBeInTheDocument();

    const confirmButton = screen.getByText('Yes, Delete');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });
  });

  it('handles like functionality', () => {
    const mockOnLike = jest.fn();
    
    renderWithRouter(
      <Post post={mockPost} onLike={mockOnLike} />
    );

    const likeButton = screen.getByLabelText('Like post');
    fireEvent.click(likeButton);

    expect(mockOnLike).toHaveBeenCalledWith('1');
  });
});