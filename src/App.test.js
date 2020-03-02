import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import App from './App';
import pokemons from './data';

afterEach(cleanup);

describe('Pokemon test 1 - 5', () => {
  test('renders a reading with the text `Pokédex`', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const heading = getByText(/Pokédex/i);
    expect(heading).toBeInTheDocument();
  });

  test('shows the Pokedéx when the route is `/`', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(getByText('Encountered pokémons')).toBeInTheDocument();
  });

  test('shows one Pokemon in Pokedéx', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(getByText(/Average weight:/)).toBeInTheDocument();
    expect(getByText(/More details/)).toBeInTheDocument();
  });

  test('When pressing the next button, the page should display the next pokémon in the list', () => {
    const {
      getByText, queryByText, queryByTestId, queryByAltText,
    } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(getByText(/Próximo pokémon/)).toBeDefined();
    // Todos os pokemons
    pokemons.forEach((ele) => {
      expect(getByText(ele.name)).toBeInTheDocument();
      expect(queryByText(`Average weight: ${ele.averageWeight.value} kg`)).toBeInTheDocument();
      expect(queryByAltText(`${ele.name} sprite`)).toBeInTheDocument();
      expect(queryByTestId(`${ele.name} ${ele.type}`)).toBeInTheDocument();
      fireEvent.click(getByText(/Próximo pokémon/));
    });
    // Testando se o ciclo foi completo
    const { name, averageWeight, type } = pokemons[0];
    expect(getByText(name)).toBeInTheDocument();
    expect(queryByText(`Average weight: ${averageWeight.value} kg`)).toBeInTheDocument();
    expect(queryByAltText(`${name} sprite`)).toBeInTheDocument();
    expect(queryByTestId(`${name} ${type}`)).toBeInTheDocument();
  });

  test('The Pokédex must contain filter buttons', () => {
    const { queryByText, queryByTestId, queryByAltText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const type = ['Fire', 'Psychic', 'Electric', 'Normal', 'Dragon', 'Bug', 'Poison'];
    type.forEach((ele) => {
      const pokemonFilter = pokemons.filter((element) => element.type === ele);
      fireEvent.click(queryByTestId(`${ele}type`));
      expect(queryByText(pokemonFilter[0].name)).toBeInTheDocument();
      expect(queryByTestId(`${ele}type`).innerHTML).toBe(ele);
      pokemonFilter.forEach((eleme) => {
        expect(queryByText(eleme.name)).toBeInTheDocument();
        expect(queryByAltText(`${eleme.name} sprite`)).toBeInTheDocument();
        expect(queryByTestId(`${eleme.name} ${eleme.type}`)).toBeInTheDocument();
        expect(queryByText(`Average weight: ${eleme.averageWeight.value} kg`)).toBeInTheDocument();
        fireEvent.click(queryByText(/Próximo pokémon/));
      });
    });
  });
  test('The Pokédex must contain a button to reset the filter', () => {
    const { queryByText, queryByTestId } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const checkPokeAll = () => {
      pokemons.forEach((ele) => {
        expect(queryByTestId(`${ele.name} ${ele.type}`).innerHTML).toBe(ele.type);
        fireEvent.click(queryByText('Próximo pokémon'));
      });
    };
    expect(queryByText('All')).toBeInTheDocument();
    expect(queryByText('All')).not.toBeNull();
    checkPokeAll();
    fireEvent.click(queryByText('Dragon'));
    fireEvent.click(queryByText('All'));
    checkPokeAll();
  });
});
