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

describe('04 - Pokedex must have filter buttons', () => {
  it('when type of pokemon is selected, pokedex must show only the respective pokemons', () => {
    const { getByTestId, getAllByText, getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText(/Próximo pokémon/);

    pokemons.forEach(({ type }) => {
      expect(getByTestId(type)).toBeInTheDocument();
      fireEvent.click(getByTestId(type));
      expect(getAllByText(type).length).toEqual(2);
      const pokemonsTypes = pokemons.filter((pokemon) => pokemon.type === type);
      pokemonsTypes.forEach((pokemon) => {
        expect(getByText(pokemon.name)).toBeInTheDocument();
        if (pokemonsTypes.length > 1) {
          expect(getByText(pokemon.name)).toBeInTheDocument();
          fireEvent.click(nextPokemonButton);
        }
      });
    });
  });

  it('text of button must have be the pokemon type name', () => {
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
});

describe('05 - Pokedex must have a button for reset filter', () => {
  it('the button text should be "All"', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const allPokemonsButton = getByText(/All/);
    expect(allPokemonsButton).toBeInTheDocument();
    expect(allPokemonsButton.tagName).toBe('BUTTON');
    expect(allPokemonsButton.innerHTML).toMatch('All');
  });

  it('when click it, pokedex must circulate through all pokemons', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const allPokemonsButton = getByText(/All/);
    const nextPokemonButton = getByText(/Próximo pokémon/);
    fireEvent.click(allPokemonsButton);
    pokemons.forEach(({ name }) => {
      expect(getByText(name)).toBeInTheDocument();
      fireEvent.click(nextPokemonButton);
    });
  });

  it('when loading the page, "all" should be selected', () => {
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

describe('The Pokédex should dynamically generate a filter button for each type of Pokémon', () => {
  it('testing the Pokedex types buttons and the render of button "All"', () => {

  });
});
