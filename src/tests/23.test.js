import React from 'react';
import { cleanup } from '@testing-library/react';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

afterEach(cleanup);

describe('23.', () => {
  test('When the route not exist, pokedex shows H2 with text', () => {
    const route = '/randomic';
    const { getByText, getByAltText } = renderWithRouter(<App />, { route });
    const notFoundTag = getByText(/Page requested not found/i);
    expect(notFoundTag).toBeInTheDocument();
    expect(notFoundTag.tagName).toBe('H2');

    const imageNotFound = getByAltText('Pikachu crying because the page requested was not found');
    expect(imageNotFound).toBeInTheDocument();
    expect(imageNotFound.src).toBe('https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif');
  });
});
