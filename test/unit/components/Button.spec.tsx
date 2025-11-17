import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders with text content', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let button = screen.getByRole('button', { name: /primary/i });
    expect(button).toHaveClass('bg-gray-900');

    rerender(<Button variant="danger">Danger</Button>);
    button = screen.getByRole('button', { name: /danger/i });
    expect(button).toHaveClass('bg-red-600');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  it('renders different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole('button', { name: /small/i });
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button', { name: /large/i });
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });
});
