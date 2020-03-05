import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

afterEach(cleanup);

describe('15.', () => {
  test('Pokedex don´t have a favorite pokemon', () => {
    const { queryByText, queryByLabelText } = renderWithRouter(<App />);
    const moreDetails = queryByText(/More Details/i);
    fireEvent.click(moreDetails);

    const checkboxFavorite = queryByLabelText('Pokémon favoritado?');
    expect(checkboxFavorite.checked).toBeFalsy();
    const favoritedPage = queryByText(/Favorite Pokémons/i);
    fireEvent.click(favoritedPage);

    expect(queryByText(/Average weight:/i)).toBeNull();
  });
  test('Pokedex have pokemon at a favorite list', () => {
    const { queryByText, queryByLabelText } = renderWithRouter(<App />);
    const moreDetails = queryByText(/More Details/i);
    fireEvent.click(moreDetails);

    const checkboxFavorite = queryByLabelText('Pokémon favoritado?');
    expect(checkboxFavorite.checked).toBeFalsy();
    fireEvent.click(checkboxFavorite);

    expect(checkboxFavorite.checked).toBeTruthy();
    const favoriteRoute = queryByText(/Favorite Pokémons/i);
    fireEvent.click(favoriteRoute);

    expect(queryByText(/Average weight:/i)).toBeInTheDocument();
  });
});
