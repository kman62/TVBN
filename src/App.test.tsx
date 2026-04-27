import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the hero title', () => {
    render(<App />);
    expect(screen.getByText(/TVBN Frontend Shell/i)).toBeInTheDocument();
  });
});
