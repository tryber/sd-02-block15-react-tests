import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import App from '../App';
import pokemonsMock from '../services/mockPkmnData';

afterEach(cleanup);

describe('Pokemon Pokedex.js tests', () => {
  test('1 - Ao carregar a aplicação no caminho de URL “/”, a página principal da...', () => {
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

  test('3 - Ao apertar o botão de próximo, a página deve exibir o próximo pokémon...', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    // O botão deve conter o texto Próximo pokémon;
    const nextBtn = getByText(/Próximo pokémon/i);
    expect(nextBtn).toBeInTheDocument();
    pokemonsMock.forEach((pokemon) => {
      // Cliques sucessivos no botão devem mostrar o próximo pokémon da lista;
      expect(getByText(pokemon.name)).toBeInTheDocument();
      fireEvent.click(nextBtn);
    });
    // Ao se chegar ao último pokémon da lista, a Pokédex deve voltar para o primeiro...
    expect(getByText(pokemonsMock[0].name)).toBeInTheDocument();
  });

  test('4 - A Pokédex deve conter botões de filtro', () => {
    const { getByText, getAllByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const typePoke = pokemonsMock.map((pokemon) => pokemon.type);
    typePoke.forEach((typePokemon) => {
      // O texto do botão deve ser o nome do tipo, p. ex. Psychic.
      const nextBtn = getAllByText(typePokemon)[1] || getByText(typePokemon);
      expect(nextBtn).toBeInTheDocument();
      fireEvent.click(nextBtn);
      // A partir da seleção de um botão de tipo, a Pokédex deve circular somente pelos...
      const pokeFilter = pokemonsMock.filter((pokemon) => pokemon.type === typePokemon);
      expect(getByText(pokeFilter[0].name)).toBeInTheDocument();
    });
  });

  test('5 - A Pokédex deve conter um botão para resetar o filtro', () => {
    const { getByText, queryByTestId } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const allBtn = getByText(/All/i);
    const nextBtn = getByText(/Próximo pokémon/i);
    // O texto do botão deve ser All;
    expect(allBtn).toBeInTheDocument();
    // Quando a página carrega, o filtro selecionado deve ser o All.
    pokemonsMock.forEach(({ name }) => {
      expect(getByText(name)).toBeInTheDocument();
      fireEvent.click(nextBtn);
    });
    // Após clicá-lo, a Pokédex deve voltar a circular por todos os pokémons;
    const dragonBtn = getByText(/Dragon/i);
    fireEvent.click(dragonBtn);
    expect(getByText('Dragonair')).toBeInTheDocument();
    fireEvent.click(allBtn);
    expect(queryByTestId('Dragonair')).toBeNull();
    pokemonsMock.forEach(({ name }) => {
      expect(getByText(name)).toBeInTheDocument();
      fireEvent.click(nextBtn);
    });
    fireEvent.click(nextBtn);
    expect(getByText(pokemonsMock[1].name)).toBeInTheDocument();
  });

  test('6 - A Pokédex deve gerar, dinamicamente, um botão de filtro para cada tipo...', () => {
    const { getByText, getAllByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const allBtn = getByText(/All/i);
    const uniqueType = [...new Set(pokemonsMock.reduce((acum, { type }) => [...acum, type], []))];
    uniqueType.forEach((type) => {
      expect(allBtn).toBeInTheDocument();
      const typeBtn = getAllByText(type)[1] || getByText(type);
      expect(typeBtn).toBeInTheDocument();
    });
  });

  test('7 - O botão de Próximo pokémon deve ser desabilitado se a lista filtrada...', () => {
    const { getByText, getAllByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextBtn = getByText(/Próximo pokémon/i);
    expect(nextBtn).toBeInTheDocument();
    const uniqueType = [...new Set(pokemonsMock.reduce((acum, { type }) => [...acum, type], []))];
    uniqueType.forEach((item) => {
      const typeBtn = getAllByText(item)[1] || getByText(item);
      fireEvent.click(typeBtn);
      let arrCont = [];
      pokemonsMock.filter(({ type }) => {
        if (type === item) {
          arrCont.push(item);
        }
      });
      arrCont = arrCont.length;
      if (arrCont === 1) {
        expect(nextBtn.disabled).toBeTruthy();
      }
    });
  });
});
