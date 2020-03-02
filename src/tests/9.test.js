import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import allPokemons from '../services/pokedexDataTest';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

afterEach(cleanup);

describe('9.', () => {
  test('Pokedex have a link to details page of each pokemon', () => {
    const { getByText } = renderWithRouter(<App />);
    const pokemonDetails = getByText(/More details/i);
    const nextButton = getByText(/Próximo pokémon/i);
    allPokemons.forEach((pokemon) => {
      expect(pokemonDetails.href).toEqual(`http://localhost/pokemons/${pokemon.id}`);
      fireEvent.click(nextButton);
    });
  });
});
