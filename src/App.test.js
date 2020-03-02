import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import App from './App';
import pokemons from './data';

afterEach(cleanup);

describe('Pokemon test', () => {
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
      getByText, queryByText, queryByTestId, queryByAltText
    } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(getByText(/Próximo pokémon/)).toBeDefined();
    // Todos os pokemons
    pokemons.forEach((ele) => {
      expect(getByText(`${ele.name}`)).toBeInTheDocument();
      expect(queryByText(`Average weight: ${ele.averageWeight.value} kg`)).toBeInTheDocument();
      expect(queryByAltText(`${ele.name} sprite`)).toBeInTheDocument();
      expect(queryByTestId(`${ele.name} ${ele.type}`)).toBeInTheDocument();
      fireEvent.click(getByText(/Próximo pokémon/));
    });
    // Testando se o ciclo foi completo
    const { name, averageWeight, type } = pokemons[0];
    expect(getByText(`${name}`)).toBeInTheDocument();
    expect(queryByText(`Average weight: ${averageWeight.value} kg`)).toBeInTheDocument();
    expect(queryByAltText(`${name} sprite`)).toBeInTheDocument();
    expect(queryByTestId(`${name} ${type}`)).toBeInTheDocument();
  });
});
