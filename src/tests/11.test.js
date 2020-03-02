import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import allPokemons from '../services/pokedexDataTest';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

afterEach(cleanup);

describe('11.', () => {
  test('When clicked in more details, the location of window is changed to .../pokemons/<id>', () => {
    allPokemons.forEach((pokemon) => {
      const route = `/pokemons/${pokemon.id}`;
      const {
        getByText,
        getAllByText,
        getByAltText,
      } = renderWithRouter(<App />, { route });
      const {
        name,
        type,
        averageWeight,
        image,
      } = pokemon;
      const {
        value,
        measurementUnit,
      } = averageWeight;
      expect(getByText(name)).toBeDefined();
      expect(getAllByText(type)[0]).toBeDefined();
      expect(getByText(`Average weight: ${value} ${measurementUnit}`)).toBeDefined();
      expect(getByAltText(`${pokemon.name} sprite`));
      expect(getByAltText(`${pokemon.name} sprite`).src === image).toBeTruthy();
    });
  });
});
