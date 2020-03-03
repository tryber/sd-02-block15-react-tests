import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import renderWithRouter from '../Renderwithrouter';
import pokemonMock from '../data';
import App from '../App';

afterEach(cleanup);

function changePage(getByText) {
  const detailsPage = getByText(/details/i);
  fireEvent.click(detailsPage);
}

function testDetailsRoute(pathname) {
  const pokemonId = pokemonMock[0].id;
  expect(pathname).toBe(`/pokemons/${pokemonId}`);
}

describe('Test #11', () => {
  test('A pagina de detalhes deve exibir o nome, tipo, peso medio e imagem do pokemon exibido', () => {
    const {
      getByText, getByTestId, getAllByText, getByAltText,
    } = renderWithRouter(<App />);
    changePage(getByText);
    const nome = getByTestId(/pokemon-name/i).innerHTML;
    const pokemonFilter = [pokemonMock.find((pokemon) => pokemon.name === nome)];
    pokemonFilter.map(({
      name, type, averageWeight: { value, measurementUnit }, image,
    }) => {
      const { src, alt } = getByAltText(`${name} sprite`);
      expect(getByText(name)).toBeInTheDocument();
      expect(getAllByText(type)[0]).toBeInTheDocument();
      expect(getByText(`Average weight: ${value} ${measurementUnit}`)).toBeInTheDocument();
      expect(src).toBe(image);
      expect(alt).toMatch(`${name}`);
    });
  });
});

describe('Test #12', () => {
  test('', () => {
    const { getByText, history, queryByText } = renderWithRouter(<App />);
    changePage(getByText);
    testDetailsRoute(history.location.pathname);
    expect(queryByText(/More Details/i)).toBeNull();
  });
});

describe('Test #13', () => {
  test('A pagina de detalhes deve exibir uma seção com um resumo do pokémon', () => {
    const { getByText, history } = renderWithRouter(<App />);
    changePage(getByText);
    testDetailsRoute(history.location.pathname);

    const summaryText = getByText(/Summary/i);
    expect(summaryText).toBeInTheDocument();
    expect(summaryText.tagName).toBe('H2');

    const summary = getByText(pokemonMock[0].summary);
    expect(summary).toBeInTheDocument();
    expect(summary.tagName).toBe('P');
  });
});

describe('Test #14', () => {
  test('A pagina de detalhes deve exibir uma seção com os mapas com as localizações do pokemon', () => {
    const { getByText, history, getAllByRole } = renderWithRouter(<App />);
    changePage(getByText);
    testDetailsRoute(history.location.pathname);

    const pokemon = pokemonMock[0];

    const locations = getByText(`Game Locations of ${pokemon.name}`);
    expect(locations).toBeInTheDocument();
    expect(locations.tagName).toBe('H2');

    pokemon.foundAt.forEach(({ location, map }) => {
      const { src, alt } = getAllByRole('img').filter((img) => img.src === map)[0];

      expect(src).toBe(map);
      expect(alt).toBe(`${pokemon.name} location`);
      expect(getByText(location)).toBeInTheDocument();
    });
  });
});

describe('Test #15', () => {
  test('', () => {
    const { getByText, history, getByRole } = renderWithRouter(<App />);
    changePage(getByText);
    testDetailsRoute(history.location.pathname);

    const checkboxContainer = getByRole('checkbox');
    expect(checkboxContainer).toBeInTheDocument();
    expect(checkboxContainer.checked).toBeFalsy();

    if (!checkboxContainer.checked) {
      fireEvent.click(checkboxContainer);

      expect(checkboxContainer.checked).toBeTruthy();
    } else {
      fireEvent.click(checkboxContainer);

      expect(checkboxContainer.checked).toBeFalsy();
    }

    expect(checkboxContainer.parentNode.tagName).toBe('LABEL');
    expect(checkboxContainer.parentNode.innerHTML).toMatch('Pokémon favoritado?');
  });
});

describe('Test #16', () => {
  test('', () => {
    const {
      getByText, history, getAllByRole, getByRole,
    } = renderWithRouter(<App />);
    changePage(getByText);
    testDetailsRoute(history.location.pathname);

    const checkboxContainer = getByRole('checkbox');

    if (checkboxContainer.checked) {
      const { src, alt, tagName } = getAllByRole('img').filter((img) => img.src === 'http://localhost/star-icon.svg')[0];

      expect(checkboxContainer.checked).toBeTruthy();
      expect(tagName).toBe('IMG');
      expect(src).toMatch(/\/star-icon.svg/i);
      expect(alt).toBe(`${pokemonMock[0].name} is marked as favorite`);
    }
  });
});
