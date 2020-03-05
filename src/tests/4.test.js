import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import allPokemons from '../services/pokedexDataTest';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

afterEach(cleanup);

describe('4.', () => {
  test('Pokedex have filter buttons', () => {
    const { getAllByText, getByText } = renderWithRouter(<App />);
    const pokemonTypes = new Set(allPokemons.map(({ type }) => type));
    pokemonTypes.forEach((type) => {
      const actualType = getAllByText(type)[1] || getByText(type);
      expect(actualType).toBeInTheDocument();
      fireEvent.click(actualType);
      expect(getAllByText(type).length).toBe(2);
      fireEvent.click(actualType);
      expect(getAllByText(type).length).toBe(2);
    });
  });
});
