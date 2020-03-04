import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

describe('20.', () => {
  test('When clicked in favorite Pokemons text, the route changed to favorite component (/favorites)', () => {
    const { queryByText, history } = renderWithRouter(<App />);
    const favoriteText = queryByText(/Favorite Pokémons/i);
    expect(history.location.pathname).toBe('/');
    fireEvent.click(favoriteText);
    expect(history.location.pathname).toBe('/favorites');
  });
});
