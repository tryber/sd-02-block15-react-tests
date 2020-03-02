import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
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

function renderWithRouter(
  ui,
  { route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {},
) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    history,
  };
}

afterEach(cleanup);

describe('Page Pokedex', () => {
  const { container, getByTestId } = renderWithRouter(
    <Pokedex pokemons={data} isPokemonFavoriteById={ids} />,
  );
  const div = document.createElement('div');
  div.innerHTML = container.innerHTML;

  test('render only one <Pokemon />', () => {
    const pokemon = div.querySelectorAll('.pokemon');
    expect(pokemon).toHaveLength(1);
  });

  test('On click "Próximo Pokemon", should render "Charmander"', async () => {
    const btn = div.querySelector('.pokedex-button');
    fireEvent.click(btn);
    const pokemon = await getByTestId('pokemon');
    console.log(pokemon.outerHTML);
  });
});
