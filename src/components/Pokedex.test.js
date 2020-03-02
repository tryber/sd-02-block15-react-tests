import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import App from '../App';
import pokemons from '../data';

afterEach(cleanup);

const arrayOfPokemonsName = pokemons.reduce((pv, cv) => {
  pv.push(cv.name);
  return pv;
}, []);

const arrayOfPokemonsTypes = pokemons.reduce((pv, cv) => {
  pv.push(cv.type);
  return pv;
}, []);


test('2 - Pokedex shows only one pokemon each time', () => {
  const { getAllByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );
  const moreDetailLength = getAllByText('More details').length;
  expect(moreDetailLength).toBe(1);
});

describe('3 - onClick shows the next Pokemon', () => {
  test('3.1 - The button must contain "Proximo Pokémon"', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    expect(nextPokemonButton).toBeInTheDocument();
  });
  test('3.2 - Sequential clicks should change for the next Pokemon', () => {
    const nPokemons = arrayOfPokemonsName.length;
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    for (let i = 0; i < nPokemons; i += 1) {
      const pokemonName = getByText(arrayOfPokemonsName[i]);
      expect(pokemonName).toBeInTheDocument();
      fireEvent.click(nextPokemonButton);
    }
  });
  test('3.3 - After the last pokemon, it should go back to the first one', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    arrayOfPokemonsName.forEach(() => fireEvent.click(nextPokemonButton));
    const pokemonName = getByText(arrayOfPokemonsName[0]);
    expect(pokemonName).toBeInTheDocument();
  });
});

describe('4 - Pokedex should contain filter buttons', () => {
  test('4.1 - Type filter should select only the pokemons with respective type', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const allPokemonTypes = [...new Set(arrayOfPokemonsTypes)];
    const nextPokemonButton = getByText('Próximo pokémon');
    let typeButton = getByText(allPokemonTypes[1]);
    fireEvent.click(typeButton);
    allPokemonTypes.forEach((tipo) => {
      typeButton = getByText(tipo);
      fireEvent.click(typeButton);
      const nomesPokemonsTipos = pokemons.filter((e) => e.type === tipo);
      for (let i = 0; i < nomesPokemonsTipos.length; i += 1) {
        const pokemonName = getByText(nomesPokemonsTipos[i].name);
        expect(pokemonName).toBeInTheDocument();
        if (nomesPokemonsTipos.length > 1) fireEvent.click(nextPokemonButton);
      }
    });
  });
  test('4.2 - The button text should be the name of the type', () => {
    const { getByText, getAllByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    arrayOfPokemonsTypes.forEach((tipo) => {
      const btnNameType = getAllByText(tipo)[1] || getByText(tipo);
      expect(btnNameType).toBeInTheDocument();
    });
  });
});
