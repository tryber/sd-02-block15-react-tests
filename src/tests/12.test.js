import React from 'react';
import { cleanup } from '@testing-library/react';
import allPokemons from '../services/pokedexDataTest';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

afterEach(cleanup);

describe('12', () => {
  test('Pokedex don`t shows more details link in details page', () => {
    allPokemons.forEach((pokemon) => {
      const route = `/pokemons/${pokemon.id}`;
      const { queryByText } = renderWithRouter(<App />, { route });
      expect(queryByText(/More details/i)).toBeNull();
    });
  });
});
