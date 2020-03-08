import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { cleanup, fireEvent, render } from '@testing-library/react';
import App from './App';
import pokemonsMock from './services/mockPkmnData';

afterEach(cleanup);

describe('Pokemon app.js tests', () => {
  test('0 - Renders a reading with the text `Pokédex`', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const heading = getByText(/Pokédex/i);
    expect(heading).toBeInTheDocument();
  });

  test('10 - Ao clicar no link de navegação do pokémon, a aplicação deve ser redirecionada...', () => {
    const history = createMemoryHistory();
    const { getByText, queryByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    pokemonsMock.forEach((pokemon, index) => {
      const moreDetails = queryByText('More details');
      const page = `/pokemons/${pokemon.id}`;
      fireEvent.click(moreDetails);
      expect(history.location.pathname).toBe(page);
      history.push('/');
      for (let i = 0; i <= index; i += 1) {
        const nextBtn = getByText(/Próximo pokémon/i);
        fireEvent.click(nextBtn);
      }
    });
  });

  test('17 - No topo da aplicação, deve haver um conjunto fixo de links de navegação', () => {
    const history = createMemoryHistory();
    const { queryByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    const localhost = 'http://localhost';
    // O primeiro link deve possuir o texto Home com a URL
    expect(queryByText('Home')).toBeInTheDocument();
    expect(queryByText('Home').href).toBe(`${localhost}/`);
    // O segundo link deve possuir o texto About com a URL /about
    expect(queryByText('About')).toBeInTheDocument();
    expect(queryByText('About').href).toBe(`${localhost}/about`);
    // O terceiro link deve possuir o texto Favorite Pokémons com a URL /favorites
    expect(queryByText('Favorite Pokémons')).toBeInTheDocument();
    expect(queryByText('Favorite Pokémons').href).toBe(`${localhost}/favorites`);
  });

  test('18 - Ao clicar no link "Home" na barra de navegação, a aplicação deve ser redirecionada...', () => {
    const history = createMemoryHistory();
    const { queryByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    fireEvent.click(queryByText('Home'));
    const page = '/';
    expect(history.location.pathname).toBe(page);
  });

  test('19 - Ao clicar no link "About" na barra de navegação, a aplicação deve ser redirecionada...', () => {
    const history = createMemoryHistory();
    const { queryByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    fireEvent.click(queryByText('About'));
    const page = '/about';
    expect(history.location.pathname).toBe(page);
  });

  test('20 - Ao clicar no link "Favorite Pokémons" na barra de navegação, a aplicação deve ser...', () => {
    const history = createMemoryHistory();
    const { queryByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    fireEvent.click(queryByText('Favorite Pokémons'));
    const page = '/favorites';
    expect(history.location.pathname).toBe(page);
  });
});
