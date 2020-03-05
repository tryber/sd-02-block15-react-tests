import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import allPokemons from '../services/pokedexDataTest';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

afterEach(cleanup);

describe('10.', () => {
  test('When clicked in more details, the location of window is changed to .../pokemons/<id>', () => {
    const { getByText, history } = renderWithRouter(<App />);
    const pokemonDetails = getByText(/More details/i);
    fireEvent.click(pokemonDetails);
    expect(history.location.pathname).toBe(`/pokemons/${allPokemons[0].id}`);
  });
  test('When clicked in more details, the location of window is changed to .../pokemons/<id>', () => {
    const { getByText, history } = renderWithRouter(<App />);
    const pokemonDetails = getByText(/More details/i);
    const nextButton = getByText(/Próximo pokémon/i);
    fireEvent.click(nextButton);
    fireEvent.click(pokemonDetails);
    expect(history.location.pathname).toBe(`/pokemons/${allPokemons[1].id}`);
  });
});
