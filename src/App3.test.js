import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { render, cleanup, fireEvent } from '@testing-library/react';
import App from './App';
import pokemons from './data2';

afterEach(cleanup);

describe('Pokemon test 11 - 16', () => {
  test('11, 12, 13, 14, 15, 16', () => {
    const history = createMemoryHistory();
    const {
      getByText, queryByLabelText, queryByText, queryAllByAltText, queryByAltText,
    } = render(
      <Router history={history}>
        <App />
      </Router>,
    );

    pokemons.forEach((pokemon, index) => {
      const {
        name, summary, foundAt, image, type, averageWeight: { value, measurementUnit },
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
      foundAt.forEach(({ location, map }, inde) => {
        expect(queryByText(location)).toBeInTheDocument();
        expect(queryAllByAltText(`${name} location`)[inde]).toBeInTheDocument();
        expect(queryAllByAltText(`${name} location`)[inde].src).toBe(map);
      });
      // 15
      expect(queryByLabelText('Pokémon favoritado?')).toBeInTheDocument();
      fireEvent.click(queryByLabelText('Pokémon favoritado?'));
      expect(queryByLabelText('Pokémon favoritado?').checked).toBeTruthy();
      // 16
      expect(queryByAltText(`${name} is marked as favorite`)).toBeInTheDocument();
      expect(queryByAltText(`${name} is marked as favorite`).src).toBe('http://localhost/star-icon.svg');
      expect(JSON.parse(localStorage.getItem('favoritePokemonIds')).some((ele) => ele === pokemon.id)).toBeTruthy();
      // 15
      fireEvent.click(queryByLabelText('Pokémon favoritado?'));
      expect(queryByLabelText('Pokémon favoritado?').checked).not.toBeTruthy();
      expect(JSON.parse(localStorage.getItem('favoritePokemonIds')).some((ele) => ele === pokemon.id)).not.toBeTruthy();
      history.push('/');
      for (let i = 0; i < index + 1; i += 1) {
        fireEvent.click(queryByText('Próximo pokémon'));
      }
    });
  });
});
