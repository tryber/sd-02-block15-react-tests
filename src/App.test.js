import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import App from './App';
import { Pokedex, FavoritePokemons } from './components';
import pokemons from './mockData';

afterEach(cleanup);

const isPokemonFavoriteById = {
  25: true,
  4: true,
  10: true,
  23: false,
  65: true,
  151: true,
  78: false,
  143: true,
  148: false,
};

const pokemonsName = pokemons.map(({ name }) => name);
const pokemonsType = pokemons.map(({ type }) => type);

describe('test 1 - shows pokedex in main page', () => {
  it('1.1 - renders a heading with the text `Pokédex`', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const heading = getByText(/Pokédex/i);
    expect(heading).toBeInTheDocument();
  });

  it('1.2 - shows the Pokedéx when the route is `/`', () => {
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

describe('test 2 - only one pokemon each page', () => {
  it('2.0 - shows only one pokemon at once', () => {
    const { getAllByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(getAllByText(/more details/i).length).toBe(1);
    expect(getAllByText(/more details/i)[1]).toBeUndefined();
  });
});

describe('test 3 - next button shows next pokemon', () => {
  it("3.1 - button must contain 'proximo pokemon'", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(getByText(/próximo pokémon/i)).toBeInTheDocument();
  });
  it('3.2 - multiple clicks must show next pokemon', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
      </MemoryRouter>,
    );
    const nextButton = getByText(/próximo pokémon/i);
    pokemonsName.forEach((pokemon) => {
      expect(getByText(pokemon)).toBeInTheDocument();
      fireEvent.click(nextButton);
    });
  });
  it('3.3 - after last pokémon must return to the first one', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
      </MemoryRouter>,
    );
    const nextButton = getByText(/próximo pokémon/i);
    pokemonsName.forEach(() => fireEvent.click(nextButton));
    expect(getByText(pokemonsName[0])).toBeInTheDocument();
  });
});
describe('Test 4 - pokédex must contain filter buttons', () => {
  it('4.1 - button type must select only pokemons of that type', () => {
    const { getByText, getAllByText } = render(
      <MemoryRouter>
        <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
      </MemoryRouter>,
    );
    const filteredTypes = pokemonsType.filter((item, index, array) => array.indexOf(item) === index);
    const nextButton = getByText(/Próximo pokémon/i);
    filteredTypes.forEach((type) => {
      const typeButton = getAllByText(type)[1] || getByText(type);
      fireEvent.click(typeButton);
      // parei aqui
      const nomesPokemonsTipos = pokemons.filter((e) => e.type === type);
      console.log(nomesPokemonsTipos);
      nomesPokemonsTipos.forEach((pokemonType, index) => {
        expect(getByText(nomesPokemonsTipos[index].name)).toBeInTheDocument();
        if (nomesPokemonsTipos.length > 1) fireEvent.click(nextButton);
      });
    });
  });
});
