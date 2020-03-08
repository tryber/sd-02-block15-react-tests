import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { cleanup, fireEvent, render } from '@testing-library/react';
import App from '../App';
import pokemonsMock from '../services/mockPkmnData';

afterEach(cleanup);

describe('Pokemon FavoritePokemons.js tests', () => {
  test('22 - A página de pokémon favoritos deve exibir os pokémons favoritos', () => {
    const history = createMemoryHistory();
    const { queryByText, queryByLabelText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    // Iniciando App, nenhum Pokémon favorito
    let locStor = JSON.parse(localStorage.getItem('favoritePokemonIds')) || [];
    let filterFavorited = [];
    let filterNotFavorited = [];
    locStor.forEach((item) => {
      filterFavorited = filterFavorited.concat(pokemonsMock.filter(({ id }) => id === item));
    });
    filterNotFavorited = pokemonsMock;
    locStor.forEach((item) => {
      filterNotFavorited = filterNotFavorited.filter(({ id }) => id !== item);
    });
    fireEvent.click(queryByText('Favorite Pokémons'));
    expect(history.location.pathname).toBe('/favorites');
    if (filterFavorited === 0) {
      expect(queryByText('No favorite pokemon found', { selector: 'p' })).toBeInTheDocument();
    }
    filterNotFavorited.forEach(({ name }) => {
      expect(queryByText(name)).not.toBeInTheDocument();
    });
    // Marcando 3 pokémons como favoritos
    const favMock = [];
    favMock.push(pokemonsMock[0].id, pokemonsMock[5].id, pokemonsMock[7].id);
    favMock.forEach((id) => {
      history.push(`/pokemons/${id}`);
      fireEvent.click(queryByLabelText('Pokémon favoritado?'));
      history.push('/');
    });
    // Pegando a localStorage
    locStor = JSON.parse(localStorage.getItem('favoritePokemonIds')) || [];
    locStor.forEach((item) => {
      filterFavorited = filterFavorited.concat(pokemonsMock.filter(({ id }) => id === item));
    });
    filterNotFavorited = pokemonsMock;
    locStor.forEach((item) => {
      filterNotFavorited = filterNotFavorited.filter(({ id }) => id !== item);
    });
    fireEvent.click(queryByText('Favorite Pokémons'));
    expect(history.location.pathname).toBe('/favorites');
    if (filterFavorited > 0) {
      expect(queryByText('No favorite pokemon found', { selector: 'p' })).not.toBeInTheDocument();
    }
    // A página deve exibir todos os pokémons favoritados
    filterFavorited.forEach(({ name }) => {
      expect(queryByText(name)).toBeInTheDocument();
    });
    // A página não deve exibir nenhum pokémon não favoritado
    filterNotFavorited.forEach(({ name }) => {
      expect(queryByText(name)).not.toBeInTheDocument();
    });
  });
});
