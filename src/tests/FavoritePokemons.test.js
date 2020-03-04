import React from 'react';
import { cleanup } from '@testing-library/react';
import renderWithRouter from '../Renderwithrouter';
import { FavoritePokemons } from '../components';
import pokemonMock from '../data';

const mockFavoritedPokemons = {
  25: true,
  23: true,
  78: true,
  148: true,
};

const pokemons = pokemonMock.filter(({ id }) => mockFavoritedPokemons[id]);
afterEach(cleanup);

describe('Test #22', () => {
  test('A página deve exibir todos os pokémons favoritados e nao exibir os não favoritados', () => {
    const { queryByText } = renderWithRouter(<FavoritePokemons pokemons={pokemons} />);

    pokemonMock.forEach((pokemon) => {
      const favorites = Object.keys(mockFavoritedPokemons);
      const isExist = favorites.some((id) => pokemon.id === parseInt(id, 10));
      if (isExist) {
        expect(queryByText(pokemon.name)).toBeInTheDocument();
      } else {
        expect(queryByText(pokemon.name)).not.toBeInTheDocument();
        expect(queryByText(pokemon.name)).toBeNull();
      }
    });
  });
});
