import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { render, cleanup, fireEvent } from '@testing-library/react';
import App from './App';
import pokemons from './data';

afterEach(cleanup);

describe('Pokemon test 11 - 15', () => {
  test('The Pokémon details page should display the name, type, average weight and image of the Pokémon displayed and not Product Details link', () => {
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
      expect(queryByText('More details')).toBeNull();
      history.push('/');
      for (let i = 0; i < index + 1; i += 1) {
        fireEvent.click(queryByText('Próximo pokémon'));
      }
    });
  });
});
