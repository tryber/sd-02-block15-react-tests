import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import App from './App';
import pokemons from './data';

afterEach(cleanup);

describe('Pokemon test 6 - 10', () => {
  test('The Pokédex should dynamically generate a filter button for each type of Pokémon', () => {
    const { queryByTestId, getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const type = pokemons.reduce((acc, curr) => [...acc, curr.type], []);
    type.forEach((ele) => {
      expect(getByText('All')).toBeInTheDocument();
      expect(queryByTestId(`${ele}type`).innerHTML).toBe(ele);
    });
  });
});
