import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import renderWithRouter from '../Renderwithrouter';
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
  test('Apertando o botao de proximo, deve exibir o proximo pokemon da lista', () => {
    const { getByTestId, getByText } = renderWithRouter(<App />);

    // Salva o primeiro pokemon da lista
    // Na variavel firstPokemon
    const firstPokemon = getByTestId(/pokemon-name/i).innerHTML;
    const nextButton = getByText(/Próximo Pokémon/i);

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
