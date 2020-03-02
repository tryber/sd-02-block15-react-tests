import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import App from './App';

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
    const { getByText, queryByText, getByAltText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(getByText(/Próximo pokémon/)).toBeDefined();
    // Charmander
    fireEvent.click(getByText(/Próximo pokémon/));
    expect(getByText(/Charmander/)).toBeInTheDocument();
    expect(queryByText('Average weight: 8.5 kg')).toBeInTheDocument();
    expect(getByAltText(/Charmander sprite/)).toBeInTheDocument();
    // Caterpie
    fireEvent.click(getByText(/Próximo pokémon/));
    expect(getByText(/Caterpie/)).toBeInTheDocument();
    expect(queryByText('Average weight: 2.9 kg')).toBeInTheDocument();
    expect(getByAltText(/Caterpie sprite/)).toBeInTheDocument();
    // Ekans
    fireEvent.click(getByText(/Próximo pokémon/));
    expect(getByText(/Ekans/)).toBeInTheDocument();
    expect(queryByText('Average weight: 6.9 kg')).toBeInTheDocument();
    expect(getByAltText(/Ekans sprite/)).toBeInTheDocument();
    // Alakazam
    fireEvent.click(getByText(/Próximo pokémon/));
    expect(getByText(/Alakazam/)).toBeInTheDocument();
    expect(queryByText('Average weight: 48.0 kg')).toBeInTheDocument();
    expect(getByAltText(/Alakazam sprite/)).toBeInTheDocument();
    // Mew
    fireEvent.click(getByText(/Próximo pokémon/));
    expect(getByText(/Mew/)).toBeInTheDocument();
    expect(queryByText('Average weight: 4.0 kg')).toBeInTheDocument();
    expect(getByAltText(/Mew sprite/)).toBeInTheDocument();
    // Rapidash
    fireEvent.click(getByText(/Próximo pokémon/));
    expect(getByText(/Rapidash/)).toBeInTheDocument();
    expect(queryByText('Average weight: 95.0 kg')).toBeInTheDocument();
    expect(getByAltText(/Rapidash sprite/)).toBeInTheDocument();
    // Snorlax
    fireEvent.click(getByText(/Próximo pokémon/));
    expect(getByText(/Snorlax/)).toBeInTheDocument();
    expect(queryByText('Average weight: 460.0 kg')).toBeInTheDocument();
    expect(getByAltText(/Snorlax sprite/)).toBeInTheDocument();
    // Dragonair
    fireEvent.click(getByText(/Próximo pokémon/));
    expect(getByText(/Dragonair/)).toBeInTheDocument();
    expect(queryByText('Average weight: 16.5 kg')).toBeInTheDocument();
    expect(getByAltText(/Dragonair sprite/)).toBeInTheDocument();
    // Pikachu
    fireEvent.click(getByText(/Próximo pokémon/));
    expect(getByText(/Pikachu/)).toBeInTheDocument();
    expect(queryByText('Average weight: 6.0 kg')).toBeInTheDocument();
    expect(getByAltText(/Pikachu sprite/)).toBeInTheDocument();
  });
});
