import React from 'react';
import { Router, MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, cleanup, fireEvent } from '@testing-library/react';
import pokemons from '../services/pokemons';
import App from '../App';

afterEach(cleanup);

describe('11 - The Pokémon details page should display the name, type, average weight and image of the Pokémon displayed', () => {
  it('11', () => {
    const history = createMemoryHistory();
    const { queryByText, queryByAltText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );

    pokemons.forEach((pokemon, index) => {
      const {
        name, image, type, averageWeight: { value, measurementUnit },
      } = pokemon;
      fireEvent.click(queryByText('More details'));
      expect(queryByText(name)).toBeInTheDocument();
      expect(queryByText(type)).toBeInTheDocument();
      expect(queryByText(`Average weight: ${value} ${measurementUnit}`)).toBeInTheDocument();
      expect(queryByAltText(`${name} sprite`)).toBeInTheDocument();
      expect(queryByAltText(`${name} sprite`).src).toBe(image);
      // 12 -  Details page must not contain a navigation link to display details of this Pokémon
      expect(queryByText('More details')).toBeNull();
      //
      history.push('/');
      for (let i = 0; i < index + 1; i += 1) {
        fireEvent.click(queryByText('Próximo pokémon'));
      }
    });
  });
});

describe('13 - Pokedex details page needs a summary title', () => {
  it('13', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
  });
});
