import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import allPokemons from '../services/pokedexDataTest';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

afterEach(cleanup);

describe('3.', () => {
  test('Pressing next button, pokedex shows a next pokemon of the list', () => {
    const { getByText } = renderWithRouter(<App />);
    const nextButton = getByText(/Próximo pokémon/i);
    allPokemons.map((pokemon) => {
      expect(getByText(pokemon.name)).toBeInTheDocument();
      fireEvent.click(nextButton);
    });
    expect(getByText(allPokemons[0].name)).toBeInTheDocument();
  });
});
