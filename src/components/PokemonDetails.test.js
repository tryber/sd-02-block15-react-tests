import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import App from '../App';
import data from '../data';


describe('Page PokemonDetails', () => {
  test('Should render name, type, weight of pokemon', () => {
    const history = createMemoryHistory();
    const {
      getByTestId, queryByText,
    } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    for (let i = 0; i < data.length; i += 1) {
      history.push(`/pokemons/${data[i].id}`);
      const details = getByTestId(/page-details/i);
      expect(details).toBeInTheDocument();
      expect(queryByText(/More details/i)).toBeNull();
      const pokemon = getByTestId(/pokemon/i).querySelector('.pokemon-overview');
      const name = pokemon.querySelector('p:nth-of-type(1)');
      const type = pokemon.querySelector('p:nth-of-type(2)');
      const weight = pokemon.querySelector('p:nth-of-type(3)');
      expect(name.innerHTML).toBe(data[i].name);
      expect(type.innerHTML).toBe(data[i].type);
      const { value: v, measurementUnit: m } = data[i].averageWeight;
      expect(weight.innerHTML).toBe(`Average weight: ${v} ${m}`);
    }
  });

  test('Summary', () => {
    const history = createMemoryHistory();
    const {
      getByTestId,
    } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    for (let i = 0; i < data.length; i += 1) {
      history.push(`/pokemons/${data[i].id}`);
      const summary = getByTestId(/summary/i);
      expect(summary).toBeInTheDocument();
      expect(summary.querySelector('p').innerHTML).toBe(data[i].summary);
    }
  });

  test('Locations', () => {
    const history = createMemoryHistory();
    const {
      getByText, getAllByTestId,
    } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    for (let i = 0; i < data.length; i += 1) {
      history.push(`/pokemons/${data[i].id}`);
      expect(getByText(`Game Locations of ${data[i].name}`)).toBeInTheDocument();
      const locations = getAllByTestId(/location/i);
      for (let j = 0; j < data[i].foundAt.length; j += 1) {
        const img = locations[j].querySelector('img');
        const p = locations[j].querySelector('p');
        expect(img.getAttribute('src')).toBe(data[i].foundAt[j].map);
        expect(img.getAttribute('alt')).toBe(`${data[i].name} location`);
        expect(p.firstChild.innerHTML).toBe(data[i].foundAt[j].location);
      }
    }
  });

  test('Favorite', () => {
    const history = createMemoryHistory();
    const {
      getByTestId, getByText, getAllByTestId,
    } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    for (let i = 0; i < data.length; i += 1) {
      history.push(`/pokemons/${data[i].id}`);
      const favorite = getByTestId(/favorite/i);
      expect(getByText(/Pokémon favoritado?/i)).toBeInTheDocument();
      fireEvent.click(favorite);
      history.push('/favorites');
      expect(getByTestId(/favorite-pokemons/i)).toBeInTheDocument();
      expect(getByText(data[i].name)).toBeInTheDocument();
      getAllByTestId('pokemon').forEach((item) => {
        const name = item.querySelector('.pokemon-overview')
          .querySelector('p').innerHTML;
        const icon = item.querySelector('.favorite-icon');
        expect(icon.getAttribute('src')).toBe('/star-icon.svg');
        expect(icon.getAttribute('alt')).toBe(`${name} is marked as favorite`);
      });
    }
  });
});
