import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent, getByText } from '@testing-library/react';
import pokemons from './types/mockPokemons';
import App from './App';

afterEach(cleanup)

test('1 - renders a reading with the text `Pokédex`', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const heading = getByText(/Pokédex/i);
  expect(heading).toBeInTheDocument();
});

test('2 - shows the Pokedéx when the route is `/`', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={[{ pathname: "/" }]}>
      <App />
    </MemoryRouter>,
  );

  expect(getByText('Encountered pokémons')).toBeInTheDocument();
});

test('3 - show next Pokemon when click on button - Próximo pokémon -', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  
  const buttonNxtPkm = getByText(/Próximo pokémon/i, {selector: 'button'});
  expect(buttonNxtPkm).toBeInTheDocument();
  pokemons.forEach((pokemon) => {
    expect(getByText(pokemon.name)).toBeInTheDocument();
    fireEvent.click(buttonNxtPkm);
  });
  expect(getByText(pokemons[0].name)).toBeInTheDocument();
})

test('4 - Pokedex need filters to map each pokemon by type', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  const buttonNxtPkm = getByText(/Próximo pokémon/i, {selector: 'button'});
  const allPkm = getByText(/All/i);
  pokemons.forEach((pokemon) => {
    const { type, name } = pokemon; 
    expect(getByText(type, {selector: 'button'})).toBeInTheDocument();
    console.log(pokemon.type)
  })
})
