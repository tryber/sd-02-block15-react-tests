import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Pokedex from './Pokedex';
import data from '../data';

const ids = {
  4: false,
  10: false,
  23: false,
  25: true,
  65: false,
  78: false,
  143: false,
  148: false,
  151: false,
};

const names = [
  'Charmander',
  'Caterpie', 'Ekans',
  'Alakazam', 'Mew',
  'Rapidash', 'Snorlax',
  'Dragonair', 'Pikachu',
];

function renderWithRouter(
  ui,
  { route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {},
) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    history,
  };
}

describe('Page Pokedex', () => {
  const { container } = renderWithRouter(
    <Pokedex pokemons={data} isPokemonFavoriteById={ids} />,
  );
  test('render only one <Pokemon />', () => {
    const div = document.createElement('div');
    div.innerHTML = container.innerHTML;

    const pokemon = div.querySelectorAll('.pokemon');
    expect(pokemon).toHaveLength(1);
  });

  test('On click "Próximo Pokemon", should render "Charmander"', () => {
    const { getByText, getByTestId } = renderWithRouter(
      <Pokedex pokemons={data} isPokemonFavoriteById={ids} />,
    );
    names.forEach((name) => {
      fireEvent.click(getByText(/Próximo pokémon/i));
      const pokemon = getByTestId('page-pokedex');
      const name2 = pokemon.querySelector('.pokemon-overview').firstChild;
      expect(name2.textContent).toBe(name);
    });
  });

  test('Btn types', () => {
    const { getAllByTestId, getByTestId } = renderWithRouter(
      <Pokedex pokemons={data} isPokemonFavoriteById={ids} />,
    );
    const types = data.map((pok) => pok.type);
    const pokedex = getByTestId('page-pokedex');
    const name = pokedex.querySelector('.pokemon-overview')
      .querySelector('p:nth-of-type(1)');
    const btns = getAllByTestId('type');
    for (let i = 1; i < btns.length - 1; i += 1) {
      fireEvent.click(btns[i]);
      const bool1 = types.some((type2) => btns[i].textContent === type2);
      const pokemons = data.filter((pokemon1) => pokemon1.type === btns[i].textContent);
      const bool2 = pokemons.some((pokemon2) => pokemon2.name === name.innerHTML);
      expect(bool1).toBeTruthy();
      expect(bool2).toBeTruthy();
    }
  });

  test('Btn All', () => {
    const { getAllByTestId, getByTestId } = renderWithRouter(
      <Pokedex pokemons={data} isPokemonFavoriteById={ids} />,
    );
    const btns = getAllByTestId('type');
    expect(btns[0].textContent).toBe('All');

    const pokedex = getByTestId('page-pokedex');
    const name = pokedex.querySelector('.pokemon-overview')
      .querySelector('p:nth-of-type(1)');
    expect(data[0].name).toBe(name.innerHTML);
    for (let i = 1; i < data.length; i += 1) {
      fireEvent.click(btns[btns.length - 1]);
      expect(name.innerHTML).toBe(data[i].name);
    }
  });

  test('Btn "Próximo pokémon" disabled if only one pokemon', () => {
    const { getByText } = renderWithRouter(
      <Pokedex pokemons={[data[0]]} isPokemonFavoriteById={ids} />,
    );
    const btn = getByText(/Próximo pokémon/i);
    const atts = btn.attributes;
    let bool = false;
    for (let i = 0; i < atts.length; i += 1) {
      if (atts[i].name === 'disabled') bool = true;
    }
    expect(bool).toBeTruthy();
  });

  test('Average weight: <value> <measurementUnit>', () => {
    const { getByTestId, getByText } = renderWithRouter(
      <Pokedex pokemons={data} isPokemonFavoriteById={ids} />,
    );
    const pokedex = getByTestId('page-pokedex');
    const weight = pokedex.querySelector('.pokemon-overview')
      .querySelector('p:nth-of-type(3)');

    for (let i = 0; i < data.length; i += 1) {
      const { value: v, measurementUnit: m } = data[i].averageWeight;
      expect(weight.innerHTML).toBe(`Average weight: ${v} ${m}`);
      fireEvent.click(getByText(/Próximo pokémon/i));
    }
  });

  test('Img should have src and alt', () => {
    const { getByTestId, getByText } = renderWithRouter(
      <Pokedex pokemons={data} isPokemonFavoriteById={ids} />,
    );
    const pokedex = getByTestId('page-pokedex');
    const img = pokedex.querySelector('img');

    for (let i = 0; i < data.length; i += 1) {
      const src = img.getAttribute('src');
      const alt = img.getAttribute('alt');
      const { image, name } = data[i];
      expect(src).toBe(image);
      expect(alt).toBe(`${name} sprite`);
      fireEvent.click(getByText(/Próximo pokémon/i));
    }
  });

  test('Link "More details" should redirect to link /pokemons/<id>', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <Pokedex pokemons={data} isPokemonFavoriteById={ids} />
      </Router>,
    );
    const details = getByText(/More details/i);
    const href = details.getAttribute('href');
    expect(href).toBe(`/pokemons/${data[0].id}`);
    fireEvent.click(details);
    expect(`/pokemons/${data[0].id}`).toBe(history.location.pathname);
  });
});
