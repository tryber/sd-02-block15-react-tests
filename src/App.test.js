import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { render, fireEvent, cleanup, getAllByTestId } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import App from './App';

const arrayPokemons = [
  { name: 'Pikachu', type: 'Electric', averageWeight: '6.0 kg' },
  { name: 'Charmander', type: 'Fire', averageWeight: '8.5 kg' },
  { name: 'Caterpie', type: 'Bug', averageWeight: '2.9 kg' },
  { name: 'Ekans', type: 'Poison', averageWeight: '6.9 kg' },
  { name: 'Alakazam', type: 'Psychic', averageWeight: '48.0 kg' },
  { name: 'Mew', type: 'Psychic', averageWeight: '4.0 kg' },
  { name: 'Rapidash', type: 'Fire', averageWeight: '95.0 kg' },
  { name: 'Snorlax', type: 'Normal', averageWeight: '460.0 kg' },
  { name: 'Dragonair', type: 'Dragon', averageWeight: '16.5 kg' },
];

function renderWithRouter(
  ui,
  { route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {},
) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    history,
  };
}

afterEach(cleanup);

describe('0 - Teste inicial', () => {
  test('renders a reading with the text `Pokédex`', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const heading = getByText(/Pokédex/i);
    expect(heading).toBeInTheDocument();
  });
});

describe('1 - Ao carregar a aplicação no caminho de URL “/”, a página principal da Pokédex deve ser mostrada', () => {
  test('shows the Pokedéx when the route is `/`', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
  
    expect(getByText('Encountered pokémons')).toBeInTheDocument();
  });
});

describe('2 - A Pokédex deve exibir apenas um pokémon por vez', () => {
  test('exibe apenas um pokémon na primeira renderização', () => {
    const { getAllByText, getAllByTestId } = renderWithRouter(<App />);
    const arrayAverageWeight = getAllByText(/Average weight:/);
    expect(arrayAverageWeight.length).toBe(1);

    const arrayMoreDetails = getAllByText('More details');
    expect(arrayMoreDetails.length).toBe(1);

    const arrayPokemonName = getAllByTestId('pokemon-name');
    expect(arrayPokemonName.length).toBe(1);

    const arrayPokemonType = getAllByTestId('pokemon-type');
    expect(arrayPokemonType.length).toBe(1);

    const arrayPokemonImage = getAllByTestId('pokemon-image');
    expect(arrayPokemonImage.length).toBe(1);
  });

  test('exibe apenas um pokémon ao clicar em vários botões aleatoriamente dentro da mesma página', () => {
    const { getAllByText, getAllByTestId } = renderWithRouter(<App />);

    const botoes = document.getElementsByTagName('button');

    for (let i = 0; i < 100; i += 1) {
      const indexAleatorio = Math.round(Math.random() * 8);
      const botao = botoes[indexAleatorio];
  
      fireEvent.click(botao);
  
      const arrayAverageWeight = getAllByText(/Average weight:/);
      expect(arrayAverageWeight.length).toBe(1);
  
      const arrayMoreDetails = getAllByText('More details');
      expect(arrayMoreDetails.length).toBe(1);
  
      const arrayPokemonName = getAllByTestId('pokemon-name');
      expect(arrayPokemonName.length).toBe(1);
    
      const arrayPokemonType = getAllByTestId('pokemon-type');
      expect(arrayPokemonType.length).toBe(1);
    
      const arrayPokemonImage = getAllByTestId('pokemon-image');
      expect(arrayPokemonImage.length).toBe(1);
    }
  });
});

describe('3 - Ao apertar o botão de próximo, a página deve exibir o próximo pokémon da lista', () => {
  test('O botão deve conter o texto "Próximo pokémon"', () => {
    const { getByText } = renderWithRouter(<App />);

    const botaoProximoPokemon = getByText('Próximo pokémon');
    expect(botaoProximoPokemon).toBeInTheDocument();
  });

  test('Cliques sucessivos no botão devem mostrar o próximo pokémon da lista', () => {
    const { getByText } = renderWithRouter(<App />);

    const botaoProximoPokemon = getByText('Próximo pokémon');

    for (let i = 0; i < 8; i += 1) {
      fireEvent.click(botaoProximoPokemon);

      expect(botaoProximoPokemon).toBeInTheDocument();

      const pokemonName = getByText(arrayPokemons[i + 1].name);
      expect(pokemonName).toBeInTheDocument();
    }
  });

  test('Ao se chegar ao último pokémon da lista, a Pokédex deve voltar para o primeiro pokémon no apertar do botão', () => {
    const { getByText, queryByText } = renderWithRouter(<App />);

    const botaoProximoPokemon = getByText('Próximo pokémon');

    while (queryByText(arrayPokemons[arrayPokemons.length - 1].name) === null) {
      fireEvent.click(botaoProximoPokemon);
    }

    fireEvent.click(botaoProximoPokemon);

    expect(getByText(arrayPokemons[0].name)).toBeInTheDocument();
  });
});
