import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';
import pokemons from '../data';

afterEach(cleanup);

describe('10 - when click the button "More Details" the page should redirect to the pokemon details page', () => {
  it('the URL has to change to "/pokemon/<id>"', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );

    pokemons.forEach(({ id }, index) => {
      fireEvent.click(getByText(/More details/i));
      expect(history.location.pathname).toMatch(`/pokemons/${id}`);
      fireEvent.click(getByText(/Home/));
      for (let i = 0; i <= index; i += 1) {
        fireEvent.click(getByText(/Próximo pokémon/));
        // iteração necessária para ele clicar o número de vezes correspondente
        // para ir para o pokemon certo quando volta para a página Home
        // sem isso ele volta sempre pro charmander e quebra no terceiro teste
      }
    });
  });
});

describe('11 - pokemon details page must show name, type, average weight and image of the pokemon', () => {
  it('average weight must be shown in the format "Average weight: <value> <measurementUnit>"', () => {
    const { getByText, queryByText, getByAltText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    pokemons.forEach(({
      name, type, averageWeight, image,
    }, index) => {
      fireEvent.click(getByText(/More details/i));
      expect(getByText(name)).toBeInTheDocument();
      expect(getByText(type)).toBeInTheDocument();
      expect(queryByText(`Average weight: ${averageWeight.value} ${averageWeight.measurementUnit}`)).toBeInTheDocument();
      expect(getByAltText(`${name} sprite`).src).toEqual(image);
      expect(getByAltText(`${name} sprite`)).toBeInTheDocument();
      fireEvent.click(getByText(/Home/));
      for (let i = 0; i <= index; i += 1) {
        fireEvent.click(getByText(/Próximo pokémon/));
      }
    });
  });
});

describe.skip('12 - pokemons details page shouldn\'t have a link "More details', () => {
  it('testing if there is not a "More details" link', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    pokemons.forEach((pokemon, index) => {
      fireEvent.click(getByText(/More details/i));
      expect(getByText(/More details/i)).not.toBeInTheDocument();
      fireEvent.click(getByText(/Home/));
      for (let i = 0; i < index + 1; i += 1) {
        fireEvent.click(getByText(/Próximo pokémon/));
      }
    });
  });
});

describe('13 - The details page should display a section with a summary of the Pokémon', () => {
  it('The details section should contain a <h2> with the text "Summary"', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    pokemons.forEach((pokemon, index) => {
      fireEvent.click(getByText(/More details/i));
      const summary = getByText(/Summary/i, { selector: 'h2' });
      expect(summary).toBeInTheDocument();
      fireEvent.click(getByText(/Home/));
      for (let i = 0; i < index + 1; i += 1) {
        fireEvent.click(getByText(/Próximo pokémon/));
      }
    });
  });

  it('The details section should contain a paragraph with the summary of the specific Pokémon being viewed', () => {
    const { getByText, queryByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    pokemons.forEach(({ summary }, index) => {
      fireEvent.click(getByText(/More details/i));
      expect(queryByText(summary)).toBeInTheDocument();
      fireEvent.click(getByText(/Home/));
      for (let i = 0; i < index + 1; i += 1) {
        fireEvent.click(getByText(/Próximo pokémon/));
      }
    });
  });
});

describe('14 - The details page should display a section with maps with the locations of the pokémons', () => {
  it('The details section should contain a heading h2 with the text Game Locations of <pokémon>, where <pokémon> is the name of the pokémon displayed', () => {
    const { getByText, queryByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    pokemons.forEach(({ name }, index) => {
      // v{ name, foundAt: { location } }, index
      fireEvent.click(getByText(/More details/i));
      // const summary = getByText(location, { selector: 'h2' });
      expect(queryByText(`Game Locations of ${name}`)).toBeInTheDocument();
      fireEvent.click(getByText(/Home/));
      for (let i = 0; i < index + 1; i += 1) {
        fireEvent.click(getByText(/Próximo pokémon/));
      }
    });
  });
});
