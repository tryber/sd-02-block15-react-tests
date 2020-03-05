import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { render, fireEvent, cleanup, getByTestId } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import App from './App';
import pokemons from './data';

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
      const indexAleatorio = Math.round(Math.random() * (botoes.length - 1));
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

    for (let i = 0; i < pokemons.length - 1; i += 1) {
      fireEvent.click(botaoProximoPokemon);

      expect(botaoProximoPokemon).toBeInTheDocument();

      const pokemonName = getByText(pokemons[i + 1].name);
      expect(pokemonName).toBeInTheDocument();
    }
  });

  test('Ao se chegar ao último pokémon da lista, a Pokédex deve voltar para o primeiro pokémon no apertar do botão', () => {
    const { getByText, queryByText } = renderWithRouter(<App />);

    const botaoProximoPokemon = getByText('Próximo pokémon');

    while (queryByText(pokemons[pokemons.length - 1].name) === null) {
      fireEvent.click(botaoProximoPokemon);
    }

    fireEvent.click(botaoProximoPokemon);

    expect(getByText(pokemons[0].name)).toBeInTheDocument();
  });
});

describe('4 - A Pokédex deve conter botões de filtro', () => {
  test('O texto do botão deve ser o nome do tipo, p. ex. Psychic', () => {
    const { getAllByText, getAllByTestId, getByText } = renderWithRouter(<App />);

    const arrayBotoesDeTipo = getAllByTestId('botao-de-tipo');
    const arrayTextosBotoes = arrayBotoesDeTipo.map((botao) => botao.innerHTML);
    const arrayPokemonTypes = Array.from( new Set(pokemons.map((pokemon) => pokemon.type)));

    arrayTextosBotoes.forEach((textoBotao) => {
      expect(getAllByText(textoBotao)[1] || getByText(textoBotao)).toBeInTheDocument();
      expect(arrayPokemonTypes).toContain(textoBotao);
    });
  
    expect(arrayPokemonTypes.length).toBe(arrayTextosBotoes.length);
  });

  test('A partir da seleção de um botão de tipo, a Pokédex deve circular somente pelos pokémons daquele tipo', () => {
    const { getAllByText, getAllByTestId, getByText } = renderWithRouter(<App />);

    const arrayBotoesDeTipo = getAllByTestId('botao-de-tipo');

    arrayBotoesDeTipo.forEach((botao) => {
      fireEvent.click(botao);
      expect(getAllByText(botao.innerHTML).length).toBe(2);

      for (let i = 0; i < 10; i += 1) {
        fireEvent.click(getByText('Próximo pokémon'));
        expect(getAllByText(botao.innerHTML).length).toBe(2);
      }
    });
  });
});

describe('5 - A Pokédex deve conter um botão para resetar o filtro', () => {
  test('O texto do botão deve ser "All"', () => {
    const { getByTestId } = renderWithRouter(<App />);

    const botaoAll = getByTestId('botao-all');

    expect(botaoAll).toBeInTheDocument();
    expect(botaoAll.innerHTML).toBe('All');
  });

  test('Após clicá-lo, a Pokédex deve voltar a circular por todos os pokémons', () => {
    const { getByText, getByTestId, getAllByTestId, getAllByText } = renderWithRouter(<App />);

    const arrayBotoesDeTipo = getAllByTestId('botao-de-tipo');
    const botaoAll = getByTestId('botao-all');

    arrayBotoesDeTipo.forEach((botaoDeTipo) => {
      fireEvent.click(botaoDeTipo);
      expect(getAllByText(botaoDeTipo.innerHTML).length).toBe(2);

      for (let i = 0; i < 10; i += 1) {
        fireEvent.click(getByText('Próximo pokémon'));
        expect(getAllByText(botaoDeTipo.innerHTML).length).toBe(2);
      }

      fireEvent.click(botaoAll);

      const primeiroPokemonName = getByText(pokemons[0].name);
      expect(primeiroPokemonName).toBeInTheDocument();

      const botaoProximoPokemon = getByText('Próximo pokémon');

      for (let i = 0; i < pokemons.length; i += 1) {
        fireEvent.click(botaoProximoPokemon);
        const proximoPokemonName = (i < (pokemons.length - 1)) ? getByText(pokemons[i + 1].name) : getByText(pokemons[0].name);
        expect(proximoPokemonName).toBeInTheDocument();
      }
    });
  });

  test('Quando a página carrega, o filtro selecionado deve ser o "All"', () => {
    const { getByText } = renderWithRouter(<App />);

    const primeiroPokemonName = getByText(pokemons[0].name);
    expect(primeiroPokemonName).toBeInTheDocument();

    const botaoProximoPokemon = getByText('Próximo pokémon');

    for (let i = 0; i < pokemons.length - 1; i += 1) {
      fireEvent.click(botaoProximoPokemon);

      const proximoPokemonName = (i < 8) ? getByText(pokemons[i + 1].name) : getByText(pokemons[0].name);
      expect(proximoPokemonName).toBeInTheDocument();
    }
  });
});

describe('6 - A Pokédex deve gerar, dinamicamente, um botão de filtro para cada tipo de pokémon', () => {
  test('Os botões de filtragem devem ser dinâmicos: sua Pokédex deve gerar um botão de filtragem para cada tipo de pokémon disponível nos dados independente de quais ou quantos sejam, sem repetição de tipos', () => {
    const { getAllByText, getByText } = renderWithRouter(<App />);

    const pokemonTypes = Array.from(new Set(pokemons.map((pokemon) => pokemon.type)));

    pokemonTypes.forEach((type) => {
      const botaoDeTipo = getAllByText(type)[1] || getByText(type);
      expect(botaoDeTipo).toBeInTheDocument();
      expect(getAllByText(type).length).toBeLessThanOrEqual(2);
    });
  });

  test('Além disso, ela deve manter o botão "All"', () => {
    const { getByText } = renderWithRouter(<App />);

    const botaoAll = getByText('All');
    expect(botaoAll).toBeInTheDocument();
  });
});
