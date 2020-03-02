import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import App from '../App';
import arrayOfPokemonsName from '../data.modified';
import Pokemon from './Pokemon';

afterEach(cleanup);

test('2 - Pokedex shows only one pokemon each time', () => {
  const { getAllByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );
  const moreDetailLength = getAllByText('More details').length;
  expect(moreDetailLength).toBe(1);
});

describe('3 - onClick shows the next Pokemon', () => {
  test('3.1 - The button must contain "Proximo Pokémon"', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    expect(nextPokemonButton).toBeInTheDocument();
  });
  test('3.2 - Sequential clicks should change for the next Pokemon', () => {
    const nPokemons = arrayOfPokemonsName.length;
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    for (let i = 0; i < nPokemons; i += 1) {
      const pokemonName = getByText(arrayOfPokemonsName[i]);
      expect(pokemonName).toBeInTheDocument();
      fireEvent.click(nextPokemonButton);
    }
  });
  test('3.3 - After the last pokemon, it should go back to the first one', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    arrayOfPokemonsName.forEach(() => fireEvent.click(nextPokemonButton));
    const pokemonName = getByText(arrayOfPokemonsName[0]);
    expect(pokemonName).toBeInTheDocument();
  });
});
