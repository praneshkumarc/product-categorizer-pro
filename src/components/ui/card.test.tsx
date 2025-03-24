
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';

describe('Card components', () => {
  it('renders Card correctly', () => {
    render(<Card data-testid="card">Card content</Card>);
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card')).toHaveTextContent('Card content');
  });

  it('renders CardHeader correctly', () => {
    render(<CardHeader data-testid="card-header">Header content</CardHeader>);
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-header')).toHaveTextContent('Header content');
  });

  it('renders CardTitle correctly', () => {
    render(<CardTitle data-testid="card-title">Title</CardTitle>);
    expect(screen.getByTestId('card-title')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toHaveTextContent('Title');
  });

  it('renders CardDescription correctly', () => {
    render(<CardDescription data-testid="card-desc">Description</CardDescription>);
    expect(screen.getByTestId('card-desc')).toBeInTheDocument();
    expect(screen.getByTestId('card-desc')).toHaveTextContent('Description');
  });

  it('renders CardContent correctly', () => {
    render(<CardContent data-testid="card-content">Content</CardContent>);
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toHaveTextContent('Content');
  });

  it('renders CardFooter correctly', () => {
    render(<CardFooter data-testid="card-footer">Footer</CardFooter>);
    expect(screen.getByTestId('card-footer')).toBeInTheDocument();
    expect(screen.getByTestId('card-footer')).toHaveTextContent('Footer');
  });

  it('composes a complete card', () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Content goes here</CardContent>
        <CardFooter>Footer content</CardFooter>
      </Card>
    );
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Content goes here')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });
});
