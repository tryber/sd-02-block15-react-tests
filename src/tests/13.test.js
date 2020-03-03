import React from 'react';
import { cleanup } from '@testing-library/react';
import allPokemons from '../services/pokedexDataTest';
import App from '../App';
import renderWithRouter from '../services/renderWithRouter';

afterEach(cleanup);

describe('13.', () => {
  test('Pokedex details page needs a summary title and a pokemon resume', () => {
    allPokemons.forEach((pokemon) => {
      const route = `/pokemons/${pokemon.id}`;
      const { queryAllByText, queryByText } = renderWithRouter(<App />, { route });
      const summaryTitle = queryAllByText(/Summary/i);
      const summaryPokemon = queryByText(pokemon.summary);
      expect(summaryTitle[0]).toBeInTheDocument();
      expect(summaryTitle[0].tagName).toBe('H2');
      expect(summaryPokemon).toBeInTheDocument();
    });
  });
});
