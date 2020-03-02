import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import renderWithRouter from '../Renderwithrouter';
import pokemonMock from '../data';
import App from '../App';

afterEach(cleanup);

describe('Test #2', () => {
  test('Pokedex deve exibir apenas 1 pokemon por vez', () => {
    const { getAllByText, getAllByTestId } = renderWithRouter(<App />);

    const arrayOfWeight = getAllByText(/Average weight:/i);
    expect(arrayOfWeight.length).toBe(1);

    const arrayOfDetailsLink = getAllByText(/More Details/i);
    expect(arrayOfDetailsLink.length).toBe(1);

    const arrayOfPokemonName = getAllByTestId(/pokemon-name/i);
    expect(arrayOfPokemonName.length).toBe(1);
  });
});

describe('Test #3', () => {
  test('O botao deve conter o texto proximo pokemon', () => {
    const { getByText } = renderWithRouter(<App />);

    const nextButton = getByText(/Próximo Pokémon/i);
    expect(nextButton).toBeDefined();
    expect(getByText(/Próximo Pokémon/i)).toBeInTheDocument();
  });

  test('Apertando o botao de proximo, deve exibir o proximo pokemon da lista', () => {
    const { getByTestId, getByText } = renderWithRouter(<App />);

    // Salva o primeiro pokemon da lista
    // Na variavel firstPokemon
    const firstPokemon = getByTestId(/pokemon-name/i).innerHTML;
    const nextButton = getByText(/Próximo Pokémon/i);

    // Testando se o botao com o texto proximo pokémon existe na tela
    expect(getByText(/Próximo Pokémon/i)).toBeInTheDocument();
    // Testando se o pokemon existe na tela
    expect(getByText(firstPokemon)).toBeInTheDocument();

    // Clica no botao de proximo pokemon
    fireEvent.click(nextButton);

    // Salva na variavel nextPokemon
    // o proximo pokemon apos clicar no botao
    let nextPokemon = getByTestId(/pokemon-name/i).innerHTML;
    // Testando se o pokemon existe na tela
    expect(getByText(nextPokemon)).toBeInTheDocument();

    // Loop para passar por todos os pokemons da lista ate voltar pro primeiro
    // Enquanto o proximo pokemon for diferente do primeiro
    while (nextPokemon !== firstPokemon) {
      // Salva o pokemon atual mostrado na tela
      const pokemonAtual = getByTestId(/pokemon-name/i).innerHTML;
      // Testando se o pokemon existe na tela
      expect(nextButton).toBeInTheDocument();
      // Clica no botao de proximo pokemon
      fireEvent.click(nextButton);
      // Salva o proximo pokemon mostrado na tela
      nextPokemon = getByTestId(/pokemon-name/i).innerHTML;
      // Testando se o proximo pokemon existe na tela
      expect(getByText(nextPokemon)).toBeInTheDocument();
      // Testando se o proximo pokemon não é igual ao pokemon atual
      // Teste feito para ver se estamos percorrendo todos os pokemons
      expect(nextPokemon).not.toMatch(pokemonAtual);
    }
  });
});

describe('Test #4', () => {
  test('Testando se os botoes de filtro estão carregados na tela', () => {
    const { getAllByTestId, getByText, getAllByText } = renderWithRouter(<App />);
    const allButtons = getAllByTestId(/pokemon-type-button/i);
    // Passando por todos os botoes dentro de allButtons
    allButtons.forEach((button) => {
      const textButton = button.innerHTML;
      // Testando se todos os botoes de filtro estao na pagina
      expect(getAllByText(textButton)[1] || getByText(textButton)).toBeInTheDocument();
    });
  });
  test('A pokedex deve circular somente pelos pokemons que foram filtrados', () => {
    const {
      getAllByTestId, getAllByText, getByText, getByTestId,
    } = renderWithRouter(<App />);
    const nextButton = getByText(/Próximo Pokémon/i);
    const allTypeButtons = getAllByTestId(/pokemon-type-button/i);
    // Loop para pegar todos os botoes de tipo
    allTypeButtons.forEach((button) => {
      // Pegando o texto do botao
      const textButton = button.innerHTML;
      // Clicando no botao com o texto(tipo) atual
      // Como o tipo do pokemon aparece na tela quando ele é renderizado, entao,
      // temos que usar o getAllByText pq o texto do botao será o segundo
      // tipo renderizado na tela por isso a gente procura a posicao[1] do array.
      fireEvent.click(getAllByText(textButton)[1] || getByText(textButton));
      // Guarda o primeiro pokemon na variavel
      const firstPokemon = getByTestId(/pokemon-name/i).innerHTML;
      // Variavel para guardar o pokemon atual(current)
      let curPokemon = '';
      // Loop para testar se o primeiro Pokemon for diferente do atual
      while (firstPokemon !== curPokemon) {
        // Guardar o texto do label com data-testid pokemonType
        const type = getByTestId(/pokemonType/i).innerHTML;
        // Clicando no botao proximo pokemon
        fireEvent.click(nextButton);
        // Guardando o pokemon atual
        curPokemon = getByTestId(/pokemon-name/i).innerHTML;
        // Comparando se o tipo do pokemon é igual ao texto do botao clicado
        expect(type).toBe(textButton);
      }
    });
  });
});

describe('Test #5', () => {
  test('quando a pagina carrega, o filtro selecionado deve ser "all"', () => {
    const { getByText, getByTestId } = renderWithRouter(<App />);
    const nextButton = getByText(/Próximo Pokémon/i);

    // Verificando se o filtro all está selecionado
    pokemonMock.map((pokemon) => {
      const pokemonName = pokemon.name;
      const pokemonRenderName = getByTestId(/pokemon-name/i).innerHTML;
      fireEvent.click(nextButton);
      expect(pokemonName).toBe(pokemonRenderName);
    });
  });
  test('o texto do botão de resete deve ser "All" e após clicá-lo, a Pokédex deve voltar a circular por todos os pokémons', () => {
    const { getByText, getByTestId } = renderWithRouter(<App />);
    const buttonAll = getByText(/All/i);
    const nextButton = getByText(/Próximo Pokémon/i);
    const fireButton = getByText(/Fire/i);
    const firePokemons = pokemonMock.filter((pokemon) => pokemon.type === 'Fire');

    expect(buttonAll).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    expect(fireButton).toBeInTheDocument();

    fireEvent.click(fireButton);
    firePokemons.map((pokemon) => {
      const pokemonName = getByTestId(/pokemon-name/i).innerHTML;
      fireEvent.click(nextButton);

      expect(pokemon.name).toBe(pokemonName);
    });

    fireEvent.click(buttonAll);

    pokemonMock.map((pokemon) => {
      const pokemonName = getByTestId(/pokemon-name/i).innerHTML;
      fireEvent.click(nextButton);

      expect(pokemon.name).toBe(pokemonName);
    });
  });
});
