import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SentimentBadge from '../app/components/SentimentBadge';

describe('SentimentBadge Component', () => {
  test('renders "No analysis" when sentiment is null', () => {
    render(<SentimentBadge sentiment={null} />);
    expect(screen.getByText('No analysis')).toBeInTheDocument();
  });

  test('renders positive sentiment with the correct style', () => {
    render(<SentimentBadge sentiment="positive" />);
    const badge = screen.getByText('positive');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100');
    expect(badge).toHaveClass('text-green-800');
  });

  test('renders negative sentiment with the correct style', () => {
    render(<SentimentBadge sentiment="negative" />);
    const badge = screen.getByText('negative');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100');
    expect(badge).toHaveClass('text-red-800');
  });

  test('renders neutral sentiment with the correct style', () => {
    render(<SentimentBadge sentiment="neutral" />);
    const badge = screen.getByText('neutral');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-100');
    expect(badge).toHaveClass('text-blue-800');
  });

  test('renders unknown sentiment types with a default style', () => {
    render(<SentimentBadge sentiment="unknown" />);
    const badge = screen.getByText('unknown');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100');
    expect(badge).toHaveClass('text-gray-800');
  });
}); 