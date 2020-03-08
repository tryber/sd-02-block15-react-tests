import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { cleanup, fireEvent, render } from '@testing-library/react';
import App from '../App';
import pokemonsMock from '../services/mockPkmnData';

afterEach(cleanup);

describe('Pokemon PokemonDetails.js tests', () => {
  test('11 - A página de detalhes de pokémon deve exibir o nome, tipo, peso médio e imagem...', () => {
    const history = createMemoryHistory();
    const {
      getByText, getByAltText, queryByText, queryByAltText,
    } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    pokemonsMock.forEach((pokemon, index) => {
      const {
        id, name, type, averageWeight: { value, measurementUnit }, image,
      } = pokemon;
      const imageElem = getByAltText(`${name} sprite`);
      const page = `/pokemons/${id}`;
      fireEvent.click(queryByText('More details'));
      const weightText = queryByText(`Average weight: ${value} ${measurementUnit}`);
      expect(history.location.pathname).toBe(page);
      // Exibindo nome e tipo do pokémon
      expect(queryByText(name)).toBeInTheDocument();
      expect(queryByText(type)).toBeInTheDocument();
      // O peso médio do pokémon deve ser exibido com um texto no formato...
      expect(weightText).toBeInTheDocument();
      // A imagem deve conter um atributo src com a URL da imagem do pokémon...
      expect(queryByAltText(`${name} sprite`)).toBeInTheDocument();
      expect(imageElem.src).toBe(image);
      history.push('/');
      for (let i = 0; i <= index; i += 1) {
        const nextBtn = getByText(/Próximo pokémon/i);
        fireEvent.click(nextBtn);
      }
    });
  });

  test('12 - O pokémon exibido na página de detalhes não deve conter um link..', () => {
    const history = createMemoryHistory();
    const { queryByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    pokemonsMock.forEach((pokemon, index) => {
      const { id, name } = pokemon;
      expect(queryByText('More details', { selector: 'a' })).toBeInTheDocument();
      fireEvent.click(queryByText('More details'));
      const page = `/pokemons/${id}`;
      expect(history.location.pathname).toBe(page);
      expect(queryByText(`${name} Details`)).toBeInTheDocument();
      expect(queryByText('More details', { selector: 'a' })).not.toBeInTheDocument();
      history.push('/');
      for (let i = 0; i <= index; i += 1) {
        const nextBtn = queryByText(/Próximo pokémon/i);
        fireEvent.click(nextBtn);
      }
    });
  });

  test('13 - A página de detalhes deve exibir uma seção com um resumo do pokémon', () => {
    const history = createMemoryHistory();
    const { queryByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    pokemonsMock.forEach((pokemon, index) => {
      const { id, summary } = pokemon;
      fireEvent.click(queryByText('More details'));
      const page = `/pokemons/${id}`;
      expect(history.location.pathname).toBe(page);
      // A seção de detalhes deve conter um heading h2 com o texto Summary;
      expect(queryByText('Summary', { selector: 'h2' })).toBeInTheDocument();
      // A seção de detalhes deve conter um parágrafo com o resumo do pokémon específico...
      expect(queryByText(summary)).toBeInTheDocument();
      history.push('/');
      for (let i = 0; i <= index; i += 1) {
        const nextBtn = queryByText(/Próximo pokémon/i);
        fireEvent.click(nextBtn);
      }
    });
  });

  test('14 - A página de detalhes deve exibir uma seção com os mapas com as localizações...', () => {
    const history = createMemoryHistory();
    const { queryByText, queryAllByAltText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    pokemonsMock.forEach((pokemon, index) => {
      const { id, name, foundAt } = pokemon;
      fireEvent.click(queryByText('More details'));
      const page = `/pokemons/${id}`;
      expect(history.location.pathname).toBe(page);
      // A seção de detalhes deve conter um heading h2 com o texto Summary;
      expect(queryByText(`Game Locations of ${name}`, { selector: 'h2' })).toBeInTheDocument();
      // A seção de detalhes deve conter um parágrafo com o resumo do pokémon específico...
      foundAt.forEach(({ location, map }, idx) => {
        expect(queryByText(location)).toBeInTheDocument();
        expect(queryAllByAltText(`${name} location`)[idx]).toBeInTheDocument();
        expect(queryAllByAltText(`${name} location`)[idx].src).toBe(map);
      });
      history.push('/');
      for (let i = 0; i <= index; i += 1) {
        const nextBtn = queryByText(/Próximo pokémon/i);
        fireEvent.click(nextBtn);
      }
    });
  });

  test('15 - A página de detalhes deve permitir favoritar um pokémon', () => {
    const history = createMemoryHistory();
    const { queryByText, queryByLabelText, queryByAltText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    pokemonsMock.forEach((pokemon, index) => {
      const { id, name } = pokemon;
      fireEvent.click(queryByText('More details'));
      const page = `/pokemons/${id}`;
      expect(history.location.pathname).toBe(page);
      // O label do checkbox deve ser "Pokémon favoritado?"
      expect(queryByLabelText('Pokémon favoritado?')).toBeInTheDocument();
      // A página deve conter um checkbox que permita favoritar um pokémon.
      // Cliques no checkbox devem, alternadadamente, adicionar e remover o pokémon da lista...
      fireEvent.click(queryByLabelText('Pokémon favoritado?'));
      expect(queryByLabelText('Pokémon favoritado?').checked).toBeTruthy();
      let locStor = JSON.parse(localStorage.getItem('favoritePokemonIds'));
      expect((locStor).some((idNatDex) => idNatDex === id)).toBeTruthy();
      // Teste de negação
      fireEvent.click(queryByLabelText('Pokémon favoritado?'));
      expect(queryByLabelText('Pokémon favoritado?').checked).not.toBeTruthy();
      locStor = JSON.parse(localStorage.getItem('favoritePokemonIds'));
      expect((locStor).some((idNatDex) => idNatDex === id)).not.toBeTruthy();
      history.push('/');
      for (let i = 0; i <= index; i += 1) {
        const nextBtn = queryByText(/Próximo pokémon/i);
        fireEvent.click(nextBtn);
      }
    });
  });

  test('16 - Pokémons favoritados devem exibir um ícone de uma estrela', () => {
    const history = createMemoryHistory();
    const { queryByText, queryByLabelText, queryByAltText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    pokemonsMock.forEach((pokemon, index) => {
      const { id, name } = pokemon;
      fireEvent.click(queryByText('More details'));
      const page = `/pokemons/${id}`;
      expect(history.location.pathname).toBe(page);
      fireEvent.click(queryByLabelText('Pokémon favoritado?'));
      expect(queryByLabelText('Pokémon favoritado?').checked).toBeTruthy();
      // A imagem deve ter o atributo alt igual a <pokemon> is marked as favorite, onde <pokemon>...
      const favorite = `${name} is marked as favorite`;
      expect(queryByAltText(favorite)).toBeInTheDocument();
      // O ícone deve ser uma imagem, com o atributo src igual /star-icon.svg;
      expect(queryByAltText(favorite).src).toBe('http://localhost/star-icon.svg');
      let locStor = JSON.parse(localStorage.getItem('favoritePokemonIds'));
      expect((locStor).some((idNatDex) => idNatDex === id)).toBeTruthy();
      // Teste de negação
      fireEvent.click(queryByLabelText('Pokémon favoritado?'));
      expect(queryByLabelText('Pokémon favoritado?').checked).not.toBeTruthy();
      expect(queryByAltText(favorite)).not.toBeInTheDocument();
      locStor = JSON.parse(localStorage.getItem('favoritePokemonIds'));
      expect((locStor).some((idNatDex) => idNatDex === id)).not.toBeTruthy();
      history.push('/');
      for (let i = 0; i <= index; i += 1) {
        const nextBtn = queryByText(/Próximo pokémon/i);
        fireEvent.click(nextBtn);
      }
    });
  });
});
