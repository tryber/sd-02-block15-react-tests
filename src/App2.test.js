import React from 'react';
import { Route, MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent, getByText } from '@testing-library/react';
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

  test('The Next Pokémon button should be disabled if the filtered list of Pokémon has only one Pokémon', () => {
    const { queryByTestId, getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const type = pokemons.reduce((acc, curr) => [...acc, curr.type], []);
    type.forEach((element) => {
      fireEvent.click(queryByTestId(`${element}type`));
      const contagem = pokemons.filter((poke) => poke.type === element);
      if (contagem.length === 1) {
        expect(getByText(contagem[0].name)).toBeInTheDocument();
        fireEvent.click(getByText(/Próximo pokémon/));
        expect(getByText(contagem[0].name)).toBeInTheDocument();
      }
    });
  });

  test('Pokedéx must display the name, type, average weight and image of the Pokémon displayed', () => {
    const { queryByAltText, queryByText, getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    pokemons.forEach((ele) => {
      const { value, measurementUnit } = ele.averageWeight;
      expect(queryByText(`Average weight: ${value} ${measurementUnit}`)).toBeInTheDocument();
      expect(queryByAltText(`${ele.name} sprite`)).toBeInTheDocument();
      expect(pokemons.some((elemen) => elemen.image === queryByAltText(`${ele.name} sprite`).src)).toBeTruthy();
      fireEvent.click(getByText(/Próximo pokémon/));
    });
  });
  test('The pokémon displayed in Pokedéx must contain a navigation link to view details of this pokémon', () => {
    const { queryByText, getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    pokemons.forEach((pokemon) => {
      expect(getByText(/More details/).href).toBe(`http://localhost/pokemons/${pokemon.id}`);
      fireEvent.click(queryByText('Próximo pokémon'));
    });
  });
});
