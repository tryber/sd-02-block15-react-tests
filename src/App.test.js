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
      expect(queryByText('More details', {selector: 'a' })).toBeInTheDocument();
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
});
