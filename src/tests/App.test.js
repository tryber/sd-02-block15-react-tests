import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent, getByTestId } from '@testing-library/react';
import App from '../App';
import Pokemon from '../data';

afterEach(cleanup);

test.skip('renders a reading with the text `Pokédex`', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const heading = getByText(/Pokédex/i);
  expect(heading).toBeInTheDocument();
});

test.skip('1- shows the Pokedéx when the route is `/`', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );

  expect(getByText('Encountered pokémons')).toBeInTheDocument();
});

test.skip('2- shows only one Pokemon on render', () => {
  const { getAllByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );
  const onePokemon = getAllByText('More details').length;
  expect(onePokemon).toBe(1);
});

describe.skip('3- After clicking next, the page must exhibit the next pokemon from list', () => {
  test('3.1 - The button must contain "Proximo Pokémon"', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    expect(nextPokemonButton).toBeInTheDocument();
  });
  test('3.2 - Succeeding clicks must show the next pokemon from the list', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    const pokeName = Pokemon.map((data) => data.name);
    for (let i = 0; i < pokeName.length; i += 1) {
      expect(getByText(pokeName[i])).toBeInTheDocument();
      fireEvent.click(nextPokemonButton);
    }
  });
  test('3.3 - when showing the last pokemon on the list, Pokedex must go back to the first pokemon after clicking its button.', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    const pokeName = Pokemon.map((data) => data.name);
    for (let i = 0; i < pokeName.length + 1; i += 1) {
      fireEvent.click(nextPokemonButton);
      if (i === 10) {
        expect(getByText(pokeName[0])).toBeInTheDocument();
      }
    }
  });
});

describe.skip('4- Pokedéx must contain filter buttons', () => {
  test('4.1- Starting from one type to another, Pokedéx must show only pokemons from that type', () => {
    const { getByText, getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const PokeType = ['Electric', 'Fire', 'Bug', 'Poison', 'Psychic', 'Normal', 'Dragon'];
    PokeType.forEach((tipo) => {
      const typeList = Pokemon.filter((data) => data.type === tipo);
      const buttonType = getByTestId(tipo);
      const nextPokemonButton = getByText('Próximo pokémon');
      fireEvent.click(buttonType);
      for (let i = 0; i < typeList.length; i += 1) {
        expect(getByText(typeList[i].name)).toBeInTheDocument();
        fireEvent.click(nextPokemonButton);
      }
    });
  });
  test("4.2- Button's text must have the same name as type", () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const PokeType = ['Electric', 'Fire', 'Bug', 'Poison', 'Psychic', 'Normal', 'Dragon'];
    PokeType.forEach((tipo) => {
      const buttonType = getByTestId(tipo);
      expect(buttonType.innerHTML).toEqual(tipo);
    });
  });
});
describe.skip('5- Pokédex must have a button to reset filters', () => {
  test("5.1- Button's text must be 'All'", () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const resetButton = getByTestId('All');
    expect(resetButton.innerHTML).toEqual('All');
  });
  test('5.2- After clicking it, Pokédex must cicle around all pokémons', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const resetButton = getByTestId('All');
    const typeList = Pokemon.filter((data) => data.type);
    fireEvent.click(resetButton);
    expect(typeList.length).toEqual(Pokemon.length);
  });
  test('5.3- When page renders, the selected filter must be "all"', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    Pokemon.forEach((data) => {
      expect(getByText(data.name)).toBeInTheDocument();
      fireEvent.click(nextPokemonButton);
    });
  });
});
test('6- Pokédex must generate, dinamically, a filter button for every pokémon type', () => {
  const { getByTestId, getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );
  const PokeTypeList = ['All', 'Electric', 'Fire', 'Bug', 'Poison', 'Psychic', 'Normal', 'Dragon'];
  const nextPokemonButton = getByText('Próximo pokémon');
  for (let i = 0; i < Pokemon.length; i += 1) {
    expect(getByText(Pokemon[i].name)).toBeInTheDocument();
    fireEvent.click(nextPokemonButton);
  }
  PokeTypeList.forEach((tipo) => {
    const buttonType = getByTestId(tipo);
    const typeList = Pokemon.filter((poketype) => poketype.type === tipo);
    fireEvent.click(buttonType);
    for (let i = 0; i < typeList.length; i += 1) {
      expect(getByText(typeList[i].name)).toBeInTheDocument();
      fireEvent.click(nextPokemonButton);
    }
  });
});
