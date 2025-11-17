// Button.test.jsx - Update the default type test
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../../components/Button';

describe('Button Component', () => {
  // ... all your existing tests remain the same ...

  // Test button type
  it('has correct button type', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button', { name: /submit/i });
    
    expect(button).toHaveAttribute('type', 'submit');
  });

  // Test default button type - FIXED
  it('has button type by default', () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole('button', { name: /default/i });
    
    expect(button).toHaveAttribute('type', 'button');
  });
});