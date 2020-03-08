import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent, getByText } from '@testing-library/react';
import pokemons from './types/mockPokemons';
import App from './App';
import '@testing-library/jest-dom'

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
  const typesfiltered = [...new Set(pokemons.map((pokemon) =>  pokemon.type))];
  typesfiltered.forEach((type) => {
    expect(getByText(type, {selector: 'button'})).toBeInTheDocument();
    fireEvent.click(getByText(type, {selector: 'button'}));
    const pkmnFiltered = pokemons.filter((pokemon) => pokemon.type === type);
    if (pkmnFiltered.length > 1) {
      for (let i = 0; pkmnFiltered.length > i; i += 1) {
        const pkmnMapped = pokemons.filter((pokemon) => pokemon.type === type);
        expect(getByText(pkmnMapped[i].name, {selector: 'p'})).toBeInTheDocument();
        fireEvent.click(buttonNxtPkm);
      }
    }
  });
})

test('5 - Pokedex needs a button All to reset filter', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  const buttonAll = getByText(/All/i, {selector: 'button'});
  const buttonNxtPkm = getByText(/Próximo pokémon/i, {selector: 'button'});
  expect(buttonAll).toBeInTheDocument();
  fireEvent.click(buttonAll);
  pokemons.forEach((pokemon) => {
    expect(getByText(pokemon.name)).toBeInTheDocument();
    fireEvent.click(buttonNxtPkm);
  });
})

test('6 - Pokedex needs to generate a filter button for each type of pokemon', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  
  const buttonAll = getByText(/All/i, {selector: 'button'});
  const typesfiltered = [...new Set(pokemons.map((pokemon) =>  pokemon.type))];
  const buttonNxtPkm = getByText(/Próximo pokémon/i, {selector: 'button'});
  typesfiltered.forEach((type) => {
    expect(getByText(type, {selector: 'button'})).toBeInTheDocument();
    fireEvent.click(getByText(type, {selector: 'button'}));
    expect(buttonAll).toBeInTheDocument();
  });
  fireEvent.click(buttonAll);
  pokemons.forEach((pokemon) => {
    expect(getByText(pokemon.name)).toBeInTheDocument();
    fireEvent.click(buttonNxtPkm);
  });
})

test('7 - Button - Próximo pokémon - needs to be disabled when there is only 1 type', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  const typesfiltered = [...new Set(pokemons.map((pokemon) =>  pokemon.type))];
  typesfiltered.forEach((type) => {
    const pkmnFiltered = pokemons.filter((pokemon) => pokemon.type === type);
    fireEvent.click(getByText(type, {selector: 'button'}));
    if (pkmnFiltered.length === 1) {
      const buttonNxtPkm = getByText(/Próximo pokémon/i, {selector: 'button'});
      expect(buttonNxtPkm).toBeDisabled();
    }
  });
})
