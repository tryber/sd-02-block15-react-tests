import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent, cleanup } from '@testing-library/react';
import App from '../App';
import pokemons from '../data';

afterEach(cleanup);

describe('02 - testing Pokedex renderization', () => {
  it('test if pokedex shows one pokemon at a time', () => {
    const { queryAllByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(queryAllByText(/Average weight/).length).toBe(1);
  });
});

describe('03 - testing button "Próximo pokémon"', () => {
  it('button should contain the text "Próximo pokémon', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText(/Próximo pokémon/);
    expect(nextPokemonButton).toBeInTheDocument();
    expect(nextPokemonButton.tagName).toBe('BUTTON');
  });

  it('pressing the button "Próximo pokémon" the next pokémon in the list should be displayed', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText(/Próximo pokémon/);
    // fireEvent.click(nextPokemonButton);
    // expect(getByText('Charmander')).toBeInTheDocument();

    // outra forma de resolver, mais completa
    // for (let i = 0; i < pokemons.length; i += 1) {
    //   expect(getByText(pokemons[i])).toBeInTheDocument();
    //   fireEvent.click(nextPokemonButton);
    // }

    // forma refatorada
    // pokemons
    //   .map((pokemon) => pokemon.name)
    //   .forEach((pokemonName) => {
    //     expect(getByText(pokemonName)).toBeInTheDocument();
    //     fireEvent.click(nextPokemonButton);
    //   });

    // mais resumida
    pokemons.forEach(({ name }) => {
      expect(getByText(name)).toBeInTheDocument();
      fireEvent.click(nextPokemonButton);
    });
  });

  it('when in the last pokemon, the button should render the first pokémon', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText(/Próximo pokémon/);
    pokemons.forEach(() => fireEvent.click(nextPokemonButton));
    expect(getByText(pokemons[0].name)).toBeInTheDocument();
  });
});
