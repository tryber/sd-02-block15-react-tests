import React from 'react';
import { cleanup } from '@testing-library/react';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

describe('23.', () => {
  test('When the route not exist, pokedex shows H2 with text', () => {
    const route = '/randomic';
    const { getByText } = renderWithRouter(<App />, { route });
    const notFoundTag = getByText(/Page requested not found/i);
    expect(notFoundTag).toBeInTheDocument();
    expect(notFoundTag.tagName).toBe('H2');
  });
});
