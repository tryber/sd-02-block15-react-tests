import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import App from '../App';
import Pokedex from './Pokedex';
import FavoritePokemons from './FavoritePokemons'
import pokemons from '../data';

afterEach(cleanup);


const detailedExibition = (ex) => {
  const {
    getByText, getByAltText, queryByText, getAllByAltText, getByLabelText, queryByAltText,
  } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );
  pokemons.map(({
    name, type, averageWeight: { value, measurementUnit }, image, summary, foundAt,
  }, index) => {
    for (let i = 0; i < index; i += 1) {
      const nextPokemonButton = getByText('Próximo pokémon');
      fireEvent.click(nextPokemonButton);
    }
    const moreDetail = getByText('More details');
    fireEvent.click(moreDetail);
    if (ex === 10) expect(getByText(`${name} Details`)).toBeInTheDocument();
    if (ex === 11) {
      expect(getByText(name)).toBeInTheDocument();
      expect(getByText(type)).toBeInTheDocument();
      expect(getByText(`Average weight: ${value} ${measurementUnit}`)).toBeInTheDocument();
      expect(getByAltText(`${name} sprite`).src).toBe(image);
    }
    if (ex === 12) expect(queryByText('More details')).not.toBeInTheDocument();
    if (ex === 13) {
      expect(getByText('Summary')).toBeInTheDocument();
      expect(getByText('Summary').tagName).toBe('H2');
      expect(getByText(summary)).toBeInTheDocument();
      expect(getByText(summary).tagName).toBe('P');
    }
    if (ex === 14) {
      expect(getByText(`Game Locations of ${name}`)).toBeInTheDocument();
      expect(getByText(`Game Locations of ${name}`).tagName).toBe('H2');
      expect(getAllByAltText(`${name} location`).length).toBe(foundAt.length);
      for (let i = 0; i < foundAt.length; i += 1) {
        const location = getAllByAltText(`${name} location`)[i];
        expect(location.src).toBe(foundAt[i].map);
        expect(getByText(foundAt[i].location)).toBeInTheDocument();
      }
    }
    if (ex === 15) {
      expect(getByLabelText('Pokémon favoritado?')).toBeInTheDocument();
      const eMarcado = queryByAltText(`${name} is marked as favorite`);
      if (eMarcado) {
        fireEvent.click(getByLabelText('Pokémon favoritado?'));
      }
      expect(queryByAltText(`${name} is marked as favorite`)).not.toBeInTheDocument();
      fireEvent.click(getByLabelText('Pokémon favoritado?'));
      expect(queryByAltText(`${name} is marked as favorite`)).toBeInTheDocument();
      fireEvent.click(getByLabelText('Pokémon favoritado?'));
      expect(queryByAltText(`${name} is marked as favorite`)).not.toBeInTheDocument();
    }
    fireEvent.click(getByText('Home'));
  });
};

describe('10 - Changing to detail page', () => {
  test('10.1 - The URL should change', () => {
    pokemons.forEach(({ id, name }) => {
      const history = createMemoryHistory();
      history.push(`/pokemons/${id}`);
      const { getByText } = render(
        <Router history={history}>
          <App />
        </Router>,
      );
      const pokemonDetails = getByText(`${name} Details`);
      expect(pokemonDetails).toBeInTheDocument();
      expect(history.location.pathname).toBe(`/pokemons/${id}`);
    });
  });
  test('10.2 - Clicking on "More Details redirects the page', () => {
    detailedExibition(10);
  });
});

describe('11 - Detail Page should render name, type, average weight and image', () => {
  test('11.1 and 11.2 - testing name, type, average weight and image', () => {
    detailedExibition(11);
  });
});

test('12 - The pokemon at detailed page should not have a link to "More details"', () => {
  detailedExibition(12);
});

test('13 - The pokemon at detailed page should have a heading summary and a p', () => {
  detailedExibition(13);
});

test('14 - The pokemon at detailed page should have ssetions with locations', () => {
  detailedExibition(14);
});

test('15 - Clicking on star icon to make Pokemon favorite', () => {
  detailedExibition(15);
});
