import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { render, cleanup, fireEvent } from '@testing-library/react';
import App from './App';
import pokemons from './data2';

afterEach(cleanup);

describe('Pokemon test 11 - 15', () => {
  test('11, 12, 13, 14', () => {
    const history = createMemoryHistory();
    const { getByText, queryByText, queryByAltText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );

    pokemons.forEach((pokemon, index) => {
      const {
        name, summary, image, type, averageWeight: { value, measurementUnit },
      } = pokemon;
      fireEvent.click(queryByText('More details'));
      // 11
      expect(queryByText(name)).toBeInTheDocument();
      expect(queryByText(type)).toBeInTheDocument();
      expect(queryByText(`Average weight: ${value} ${measurementUnit}`)).toBeInTheDocument();
      expect(queryByAltText(`${name} sprite`)).toBeInTheDocument();
      expect(queryByAltText(`${name} sprite`).src).toBe(image);
      // 12
      expect(queryByText('More details')).toBeNull();
      // 13
      expect(getByText('Summary')).toBeInTheDocument();
      expect(getByText('Summary').tagName).toBe('H2');
      expect(queryByText(summary)).toBeInTheDocument();
      expect(getByText('Summary').nextSibling.innerHTML).toBe(summary);
      // 14
      expect(queryByText(`Game Locations of ${name}`)).toBeInTheDocument();
      expect(queryByText(`Game Locations of ${name}`).tagName).toBe('H2');
      history.push('/');
      for (let i = 0; i < index + 1; i += 1) {
        fireEvent.click(queryByText('Próximo pokémon'));
      }
    });
  });
});
