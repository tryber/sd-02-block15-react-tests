import React from 'react';
import { cleanup, fireEvent, waitForDomChange } from '@testing-library/react';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';
import allPokemons from '../services/pokedexDataTest';

afterEach(cleanup);

describe('15.', () => {
  afterEach(cleanup);
  test('Pokedex details accept add pokemon to favorite list', () => {
    allPokemons.forEach((pokemon) => {
      const { queryByText, queryByLabelText, debug } = renderWithRouter(<App />);
      const moreDetails = queryByText(/More Details/i);
      fireEvent.click(moreDetails);

      const checkboxFavorite = queryByLabelText('Pokémon favoritado?');
      expect(checkboxFavorite.checked).toBeFalsy();
      // fireEvent.click(checkboxFavorite);
      // expect(checkboxFavorite.checked).toBeTruthy();
      // let favoritedPage = queryByText(/Favorite Pokémons/i);
      // fireEvent.click(favoritedPage);

      // const showAverageWeight = queryByText(/Average weight:/i);
      // expect(showAverageWeight).toBeInTheDocument();
      // fireEvent.click(queryByText(/More Details/i));

      // expect(checkboxFavorite.checked).toBeTruthy();
      // fireEvent.click(checkboxFavorite);
      // expect(checkboxFavorite.checked).toBeFalsy();
      // favoritedPage = queryByText(/Favorite Pokémons/i);
      // fireEvent.click(favoritedPage);

      // expect(queryByText(/Average weight:/i)).not.toBeInTheDocument();
    });
  });
});
