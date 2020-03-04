import React from 'react';
import { cleanup } from '@testing-library/react';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

afterEach(cleanup);

describe('17.', () => {
  test('Pokedex header needs three links', () => {
    const { queryByText } = renderWithRouter(<App />);
    const homeText = queryByText(/Home/i);
    const aboutText = queryByText(/About/i);
    const favoritePokemonsText = queryByText(/Favorite Pokémons/i);
    const localHost = 'http://localhost';
    expect(homeText.href).toBe(`${localHost}/`);
    expect(aboutText.href).toBe(`${localHost}/about`);
    expect(favoritePokemonsText.href).toBe(`${localHost}/favorites`);
  });
});
