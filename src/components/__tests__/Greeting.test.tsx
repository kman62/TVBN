import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Greeting } from '../Greeting';

describe('Greeting', () => {
  it('renders a friendly default message', () => {
    render(<Greeting />);
    expect(screen.getByTestId('greeting-message')).toHaveTextContent('Hello, friend!');
  });

  it('renders a trimmed custom name', () => {
    render(<Greeting name="  Alex  " />);
    expect(screen.getByText(/Hello, Alex!/i)).toBeVisible();
  });
});
