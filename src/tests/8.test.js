import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import allPokemons from '../services/pokedexDataTest';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

afterEach(cleanup);

describe('8.', () => {
  test('Pokedex shows name, type and average weight of each pokemon', () => {
    const {
      getByText,
      queryAllByText,
      queryByText,
      getByAltText,
    } = renderWithRouter(<App />);
    const nextButton = getByText(/Próximo pokémon/i);
    allPokemons.forEach((pokemon) => {
      const pokemonName = getByText(pokemon.name);
      const pokemonType = queryAllByText(pokemon.type)[0];
      const pokemonWeight = queryByText(`Average weight: ${pokemon.averageWeight.value} ${pokemon.averageWeight.measurementUnit}`);
      const pokemonAltImage = getByAltText(`${pokemon.name} sprite`);
      expect(pokemonName).toBeInTheDocument();
      expect(pokemonType).toBeInTheDocument();
      expect(pokemonWeight).toBeInTheDocument();
      expect(pokemonAltImage).toBeInTheDocument();
      expect(pokemonAltImage.src === pokemon.image).toBeTruthy();
      fireEvent.click(nextButton);
    });
  });
});
