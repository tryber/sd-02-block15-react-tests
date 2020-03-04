import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import pokemons from '../services/pokemons';
import App from '../App';

afterEach(cleanup);

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

describe('4 - The Pokédex must contain filter buttons', () => {
  it('when type of pokemon is selected, pokedex must show only the respective pokemons', () => {
    const { getByTestId, getAllByText, getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonBtn = getByText(/Próximo pokémon/);
    pokemons.forEach(({ type }) => {
      expect(getByTestId(type)).toBeInTheDocument();
      fireEvent.click(getByTestId(type));
      expect(getAllByText(type).length).toEqual(2);
      const pokemonsTypes = pokemons.filter((pokemon) => pokemon.type === type);
      pokemonsTypes.forEach((pokemon) => {
        expect(getByText(pokemon.name)).toBeInTheDocument();
        if (pokemonsTypes.length > 1) {
          expect(getByText(pokemon.name)).toBeInTheDocument();
          fireEvent.click(nextPokemonBtn);
        }
      });
    });
  });
});

it('The button text must be the type name, p. ex. "Psychic"', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  pokemons.forEach(({ type }) => {
    fireEvent.click(getByTestId(type));
    expect(getByTestId(type).innerHTML).toMatch(type);
  });
});

describe('5 - The Pokédex must contain a button to reset the filter', () => {
  it('The button text must be All', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const allPokemons = getByText(/All/);
    const nextPokemonBtn = getByText(/Próximo pokémon/);

    expect(nextPokemonBtn).toBeInTheDocument();
    expect(allPokemons.tagName).toBe('BUTTON');
    expect(allPokemons.innerHTML).toMatch('All');
  });

  it('After clicking it, the Pokédex must circulate all pokémons again', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const allPokemonsBtn = getByText(/All/);
    const nextPokemonBtn = getByText(/Próximo pokémon/);
    fireEvent.click(allPokemonsBtn);
    pokemons.forEach(({ name }) => {
      expect(getByText(name)).toBeInTheDocument();
      fireEvent.click(nextPokemonBtn);
    });
  });

  it('When the page loads, the selected filter must be All', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    const nextPokemonButton = getByText('Próximo pokémon');
    pokemons.forEach(({ name }) => {
      expect(getByText(name)).toBeInTheDocument();
      fireEvent.click(nextPokemonButton);
    });
  });
});
