import React from 'react';
import { cleanup, getByText } from '@testing-library/react';
import renderWithRouter from '../services/renderWithRouter';
import allPokemons from '../services/pokedexDataTest';
import App from '../App';

describe('14.', () => {
  test('Pokedex details page show maps with locations of that pokemon', () => {
    allPokemons.forEach((pokemon) => {
      const route = `/pokemons/${pokemon.id}`;
      const { queryByText, getAllByAltText } = renderWithRouter(<App />, { route });
      const { name, foundAt } = pokemon;
      const pokemonName = queryByText(`Game Locations of ${name}`);
      expect(pokemonName).toBeInTheDocument();
      expect(pokemonName.tagName).toBe('H2');
      foundAt.forEach(({ location, map }, index) => {
        const altImage = `${name} location`;
        const tagLocation = queryByText(location);
        expect(tagLocation).toBeInTheDocument();
        const mapLocation = getAllByAltText(altImage)[index];
        expect(mapLocation.src).toBe(map);
      });
    });
  });
});
