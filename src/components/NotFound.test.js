import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import App from '../App';

afterEach(cleanup);

describe('23 - Entering an unknown URL displays the Not Found page', () => {
  it('The page must contain a h2 heading with the text "Page requested not found"', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/unknown']}>
        <App />
      </MemoryRouter>,
    );
    expect(getByText('Page requested not found', { selector: 'h2' })).toBeInTheDocument();
  });

  it('The page should display the image https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif', () => {
    const { getByAltText } = render(
      <MemoryRouter initialEntries={['/unknown']}>
        <App />
      </MemoryRouter>,
    );
    expect(getByAltText('Pikachu crying because the page requested was not found').src).toBe('https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif');
  });
});
