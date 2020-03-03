import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import pokemons from './services/pokemons';
import App from './App';

afterEach(cleanup);

test('renders a reading with the text `Pokédex`', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const heading = getByText(/Pokédex/i);
  expect(heading).toBeInTheDocument();
});

test('1 - Shows the Pokedéx when the route is `/`', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );

  expect(getByText('Encountered pokémons')).toBeInTheDocument();
});

test('2 - Pokedéx must show ONLY ONE Pokémon at a time', () => {
  const { queryAllByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const weight = queryAllByText(/Average weight:/i);

  expect(weight.length).toBe(1);
});

describe('3 - Testing "Próximo pokémon" button', () => {
  it('3 - When pressing the next button, the page should display the next pokémon in the list', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonBtn = getByText(/Próximo pokémon/);

    pokemons.forEach(({ name }) => {
      expect(getByText(name)).toBeInTheDocument();
      fireEvent.click(nextPokemonBtn);
    });
  });

  it('The button should contain the text "Próximo Pokémon', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonBtn = getByText(/Próximo pokémon/);

    expect(nextPokemonBtn).toBeInTheDocument();
    expect(nextPokemonBtn.tagName).toBe('BUTTON');
  });

  it('Upon reaching the last Pokémon on the list, the Pokédex must return to the first Pokémon at the press of the button', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonBtn = getByText(/Próximo pokémon/);

    pokemons.forEach(() => fireEvent.click(nextPokemonBtn));
    expect(getByText(pokemons[0].name)).toBeInTheDocument();
  });
});
