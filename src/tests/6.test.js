import React from 'react';
import { cleanup } from '@testing-library/react';
import allPokemons from '../services/pokedexDataTest';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

afterEach(cleanup);

describe('6.', () => {
  test('Pokedex create one filter for type of pokemon', () => {
    const { getAllByText, getByText } = renderWithRouter(<App />);
    const pokemonTypes = new Set(allPokemons.map(({ type }) => type));
    const allButton = getByText(/All/i);
    pokemonTypes.forEach((type) => {
      const actualType = getAllByText(type)[1] || getByText(type);
      expect(actualType.tagName === 'BUTTON').toBeTruthy();
      expect(actualType).toBeInTheDocument();
      expect(allButton).toBeInTheDocument();
    });
  });
});
