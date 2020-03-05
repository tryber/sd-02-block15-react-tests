import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import renderWithRouter from '../services/renderWithRouter';
import allPokemons from '../services/pokedexDataTest';
import App from '../App';

afterEach(cleanup);

describe('22.', () => {
  test('Pokedex don´t have all pokemons on the favorite list', () => {
    const { getByText, queryByText } = renderWithRouter(<App />);
    allPokemons.forEach((pokemon) => {
      const favoritePokemons = getByText(/Favorite Pokémons/i);
      fireEvent.click(favoritePokemons);
      expect(queryByText(pokemon.name)).toBeNull();
      const home = queryByText(/Home/i);
      fireEvent.click(home);
    });
  });
  test('Pokedex have all Pokemons on the favorite list', () => {
    const { getByText, getByLabelText } = renderWithRouter(<App />);
    const moreDetails = getByText(/More details/i);
    fireEvent.click(moreDetails);
    const checkbox = getByLabelText(/Pokémon favoritado?/i);
    expect(checkbox.checked).toBeFalsy();
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBeTruthy();

    // const pokemonValidate = (pokemonName) => {
    //   const favoritePokemons = getByText(/Favorite Pokémons/i);
    //   fireEvent.click(favoritePokemons);
    //   const stringPokemon = queryByText(pokemonName.name);
    //   console.log(stringPokemon.tagName);
    //   expect(stringPokemon).toBeInTheDocument();
    //   const home = queryByText(/Home/i);
    //   fireEvent.click(home);
    // };

    // allPokemons.forEach((pokemon) => {
    //   console.log('1loop');
    //   pokemonValidate(pokemon);
    // });
  });
});
