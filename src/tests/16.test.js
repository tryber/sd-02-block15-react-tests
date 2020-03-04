import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import allPokemons from '../services/pokedexDataTest';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

afterEach(cleanup);

describe('16.', () => {
  test('Pokemons shows a gold star when is favorite', () => {
    allPokemons.forEach((pokemon) => {
      const route = `/pokemons/${pokemon.id}`;
      const { getByLabelText, getByAltText } = renderWithRouter(<App />, { route });
      const checkboxFavorite = getByLabelText(/Pokémon favoritado?/i);
      expect(checkboxFavorite.checked).toBeFalsy();
      fireEvent.click(checkboxFavorite);

      expect(checkboxFavorite.checked).toBeTruthy();
      expect(getByAltText(`${pokemon.name} is marked as favorite`)).toBeDefined();
      expect(getByAltText(`${pokemon.name} is marked as favorite`).src.includes('/star-icon.svg')).toBeTruthy();
      fireEvent.click(checkboxFavorite);
    });
  });
});
