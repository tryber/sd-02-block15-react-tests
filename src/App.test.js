import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import App from './App';
import { Pokedex, FavoritePokemons } from './components';
import pokemons from './mockData';

afterEach(cleanup);

const pokemonsName = pokemons.map(({ name }) => name);
const pokemonsType = pokemons.map(({ type }) => type);

describe('Test 1 - shows pokedex in main page', () => {
  test('1.1 renders a heading with the text `Pokédex`', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const heading = getByText(/Pokédex/i);
    expect(heading).toBeInTheDocument();
  });

  test('1.2 shows the Pokedéx when the route is `/`', () => {
    const { getByText } = render(
      <MemoryRouter
        initialEntries={['/']}
      >
        <App />
      </MemoryRouter>,
    );

    expect(
      getByText('Encountered pokémons'),
    ).toBeInTheDocument();
  });
});

describe('Test 2 - only one pokemon each page', () => {
  test('shows only one pokemon at once', () => {
    const { getAllByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(getAllByText(/more details/i).length.toBe(1));
    expect(getAllByText(/more details/i)[1].toBeUndefined());
  });
});
