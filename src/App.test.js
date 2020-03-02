import React from 'react';
import { MemoryRouter } from 'react-router-dom';
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

  test('1 - Ao carregar a aplicação no caminho de URL “/”, a página principal da Pokédex deve ser mostrada.', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(getByText('Encountered pokémons')).toBeInTheDocument();
  });

  test('2 - A Pokédex deve exibir apenas um pokémon por vez', () => {
    const { getAllByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const weight = getAllByText(/Average weight:/i);
    expect(weight.length).toBe(1);
  });

  test('3 - Ao apertar o botão de próximo, a página deve exibir o próximo pokémon da lista', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextBtn = getByText(/Próximo pokémon/i);
    expect(nextBtn).toBeInTheDocument();
    pokemonsMock.forEach((pokemon) => {
      expect(getByText(pokemon.name)).toBeInTheDocument();
      fireEvent.click(nextBtn);
    });
    expect(getByText(pokemonsMock[0].name)).toBeInTheDocument();
  });
});
