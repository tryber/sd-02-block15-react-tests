import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import App from './App';
import Pokedex from './components/Pokedex';
import FavoritePokemons from './components/FavoritePokemons';
import mockData from './mockData';

test('renders a Heading with the text `Pokédex`', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  )
  const heading = getByText(/Pokédex/i);
  expect(heading).toBeInTheDocument();
});

test('shows the Pokedéx when the route is `/`', () => {
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
