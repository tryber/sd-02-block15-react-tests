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
      expect(history.location.pathname).toEqual(`/pokemons/${id}`);
      fireEvent.click(getByText(/Home/));
      for (let i = 0; i <= index; i += 1) {
        fireEvent.click(getByText(/Próximo pokémon/));
        // iteração necessária para ele clicar o número de vezes correspondente
        // para ir para o pokemon certo quando volta para a página Home
        // sem isso ele clica só uma vez, vai só até o charmander e quebra no terceiro teste
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

describe('12 - pokemons details page shouldn\'t have a link "More details', () => {
  it('testing if there is not a "More details" link', () => {
    const { queryByText, getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    pokemons.forEach((pokemon, index) => {
      fireEvent.click(getByText(/More details/i));
      expect(queryByText(/More details/i)).toBeNull();
      fireEvent.click(getByText(/Home/));
      for (let i = 0; i <= index; i += 1) {
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
      for (let i = 0; i <= index; i += 1) {
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
      for (let i = 0; i <= index; i += 1) {
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
      expect(queryByText(`Game Locations of ${name}`, { selector: 'h2' })).toBeInTheDocument();
      fireEvent.click(getByText(/Home/));
      for (let i = 0; i <= index; i += 1) {
        fireEvent.click(getByText(/Próximo pokémon/));
      }
    });
  });

  it('The details section should display all the locations of the pokémon', () => {
    const { getByText, queryByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    pokemons.forEach(({ foundAt }, index) => {
      fireEvent.click(getByText(/More details/i));
      foundAt.forEach(({ location }) => {
        expect(queryByText(location)).toBeInTheDocument();
      });
      fireEvent.click(getByText(/Home/));
      for (let i = 0; i <= index; i += 1) {
        fireEvent.click(getByText(/Próximo pokémon/));
      }
    });
  });

  it('Each location should display the location name and an image of the location map(sub requisitos 3, 4 e 5', () => {
    const { getByText, queryByText, getByTestId } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    pokemons.forEach(({ name, foundAt }, index) => {
      fireEvent.click(getByText(/More details/i));
      foundAt.forEach(({ location, map }) => {
        expect(queryByText(location)).toBeInTheDocument();
        expect(getByTestId(location).src).toBe(map);
        expect(getByTestId(location).alt).toBe(`${name} location`);
      });
      fireEvent.click(getByText(/Home/));
      for (let i = 0; i <= index; i += 1) {
        fireEvent.click(getByText(/Próximo pokémon/));
      }
    });
  });
});

describe('15 - A página de detalhes deve permitir favoritar um pokémon', () => {
  it('The page must contain a checkbox that allows you to favorite a Pokémon. Clicks in the checkbox should alternately add and remove the Pokémon from the list of favorites', () => {
    const { getByText, queryByText, getByLabelText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    pokemons.forEach(({ name }, index) => {
      fireEvent.click(getByText(/More details/i));
      expect(getByLabelText('Pokémon favoritado?').type).toBe('checkbox');
      fireEvent.click(getByLabelText('Pokémon favoritado?'));
      expect(getByLabelText('Pokémon favoritado?').checked).toBe(true);
      fireEvent.click(getByText('Favorite Pokémons'));
      expect(getByText(name)).toBeInTheDocument();
      fireEvent.click(getByText(/More details/i));
      fireEvent.click(getByLabelText('Pokémon favoritado?'));
      expect(getByLabelText('Pokémon favoritado?').checked).toBe(false);
      fireEvent.click(getByText('Favorite Pokémons'));
      expect(queryByText(name)).not.toBeInTheDocument();
      fireEvent.click(getByText(/Home/));
      for (let i = 0; i <= index; i += 1) {
        fireEvent.click(getByText(/Próximo pokémon/));
      }
    });
  });

  it('The checkbox label must be "Pokémon favoritado"', () => {
    const { getByText, getByLabelText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    pokemons.forEach((pokemon, index) => {
      fireEvent.click(getByText(/More details/i));
      expect(getByLabelText('Pokémon favoritado?')).toBeInTheDocument();
      fireEvent.click(getByText(/Home/));
      for (let i = 0; i <= index; i += 1) {
        fireEvent.click(getByText(/Próximo pokémon/));
      }
    });
  });
});

describe('16 - Favorite Pokémon should display a star icon', () => {
  it('The icon must be an image, with the src attribute equal to /star-icon.svg', () => {
    const { getByText, getByTestId, queryByTestId, getByLabelText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    pokemons.forEach((pokemon, index) => {
      fireEvent.click(getByText(/More details/i));
      fireEvent.click(getByLabelText('Pokémon favoritado?'));
      expect(getByTestId('star-icon', { selector: 'img' })).toBeInTheDocument();
      expect(getByTestId('star-icon').src).toMatch('/star-icon.svg');
      fireEvent.click(getByText(/Home/));
      for (let i = 0; i < index; i += 1) {
        fireEvent.click(getByText(/Próximo pokémon/));
      }
      expect(getByTestId('star-icon')).toBeInTheDocument();
      expect(getByTestId('star-icon').src).toMatch('/star-icon.svg');
      fireEvent.click(getByText(/More details/i));
      fireEvent.click(getByLabelText('Pokémon favoritado?'));
      expect(queryByTestId('star-icon')).not.toBeInTheDocument();
      fireEvent.click(getByText(/Home/));
      for (let i = 0; i <= index; i += 1) {
        fireEvent.click(getByText(/Próximo pokémon/));
      }
    });
  });

  it('The image must have the alt attribute equal to "<pokemon> is marked as favorite", where <pokemon> is the name of the pokemon whose details are being displayed', () => {
    const { getByText, getByTestId, queryByTestId, getByLabelText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    pokemons.forEach(({ name }, index) => {
      fireEvent.click(getByText(/More details/i));
      fireEvent.click(getByLabelText('Pokémon favoritado?'));
      expect(getByTestId('star-icon').alt).toBe(`${name} is marked as favorite`);
      fireEvent.click(getByText(/Home/));
      for (let i = 0; i < index; i += 1) {
        fireEvent.click(getByText(/Próximo pokémon/));
      }
      expect(getByTestId('star-icon').alt).toBe(`${name} is marked as favorite`);
      fireEvent.click(getByText(/More details/i));
      fireEvent.click(getByLabelText('Pokémon favoritado?'));
      expect(queryByTestId('star-icon')).not.toBeInTheDocument();
      fireEvent.click(getByText(/Home/));
      for (let i = 0; i <= index; i += 1) {
        fireEvent.click(getByText(/Próximo pokémon/));
      }
    });
  });
});
