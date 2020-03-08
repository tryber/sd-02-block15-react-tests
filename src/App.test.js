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
});
