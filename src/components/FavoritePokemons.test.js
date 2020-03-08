import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';
import pokemons from '../data';

afterEach(cleanup);

describe('The favorite Pokémon page should display favorite Pokémon', () => {
  it('The page should display all favorite Pokémon and should not display any non-favored Pokémon.', () => {
    const { getByText, queryByText, getByLabelText, getAllByTestId } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    fireEvent.click(getByText(/More details/i));
    fireEvent.click(getByLabelText(/Pokémon favoritado?/));
    fireEvent.click(getByText('Home'));
    fireEvent.click(getByText(/Próximo pokémon/i));
    fireEvent.click(getByText(/More details/i));
    fireEvent.click(getByLabelText(/Pokémon favoritado?/));
    fireEvent.click(getByText(/Favorite Pokémons/i));
    pokemons.forEach(({ name }) => {
      if (queryByText(name)) {
        expect(queryByText(name)).toBeInTheDocument();
        expect(getAllByTestId('pokemon').length).toEqual(2);
        expect(getAllByTestId('star-icon').length).toEqual(2);
      } else {
        expect(queryByText(name)).not.toBeInTheDocument();
      }
    });

    // testando o teste
    expect(getByText('Pikachu')).toBeInTheDocument();
    expect(getByText('Charmander')).toBeInTheDocument();
    expect(queryByText('Caterpie')).not.toBeInTheDocument();
    expect(queryByText('Alakazam')).not.toBeInTheDocument();
    expect(queryByText('Mew')).not.toBeInTheDocument();
    expect(queryByText('Rapidash')).not.toBeInTheDocument();
    expect(queryByText('Snorlax')).not.toBeInTheDocument();
    expect(queryByText('Dragonair')).not.toBeInTheDocument();
  });
});
