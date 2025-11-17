import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Post = ({ post, currentUser, onDelete, onLike }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  
  const isAuthor = currentUser && currentUser._id === post.author._id;
  
  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(post._id);
    }
    setShowDeleteConfirm(false);
  };
  
  const handleLike = () => {
    if (onLike) {
      onLike(post._id);
    }
  };
  
  return (
    <div className="post">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <div className="post-meta">
        <span>By {post.author.username}</span>
        <span>In {post.category.name}</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="post-actions">
        <button onClick={handleLike} aria-label="Like post">
          ❤️ {post.likes}
        </button>
        
        {isAuthor && (
          <>
            <button onClick={() => navigate(`/edit-post/${post._id}`)}>
              Edit
            </button>
            <button onClick={() => setShowDeleteConfirm(true)}>
              Delete
            </button>
          </>
        )}
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirm">
          <p>Are you sure you want to delete this post?</p>
          <button onClick={handleDelete}>Yes, Delete</button>
          <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Post;