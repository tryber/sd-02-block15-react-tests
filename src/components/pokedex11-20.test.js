import React from 'react';
import { Router, MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, cleanup, fireEvent } from '@testing-library/react';
import pokemons from '../services/pokemons';
import App from '../App';

afterEach(cleanup);

describe('11 - The Pokémon details page should display the name, type, average weight and image of the Pokémon displayed', () => {
  it('11', () => {
    const history = createMemoryHistory();
    const { queryByText, queryByAltText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );

    pokemons.forEach((pokemon, index) => {
      const {
        name, image, type, averageWeight: { value, measurementUnit },
      } = pokemon;
      fireEvent.click(queryByText('More details'));
      expect(queryByText(name)).toBeInTheDocument();
      expect(queryByText(type)).toBeInTheDocument();
      expect(queryByText(`Average weight: ${value} ${measurementUnit}`)).toBeInTheDocument();
      expect(queryByAltText(`${name} sprite`)).toBeInTheDocument();
      expect(queryByAltText(`${name} sprite`).src).toBe(image);
      // 12 -  Details page must not contain a navigation link to display details of this Pokémon
      expect(queryByText('More details')).toBeNull();
      //
      history.push('/');
      for (let i = 0; i < index + 1; i += 1) {
        fireEvent.click(queryByText('Próximo pokémon'));
      }
    });
  });
});

describe('13 - Pokedex details page needs a summary title', () => {
  it('Details section must contain a heading "h2" with the text Summary', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    fireEvent.click(getByText('More details'));
    const summaryH2 = getByText('Summary');
    expect(summaryH2).toBeInTheDocument();
    expect(summaryH2.tagName).toBe('H2');
  });
  it('Details section must contain a paragraph with specific Pokemon summary', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    fireEvent.click(getByText('More details'));
    const pokeSummary = getByText(pokemons[0].summary);
    expect(pokeSummary).toBeInTheDocument();
    expect(pokeSummary.tagName).toEqual('P');
  });
});

describe('14 - Details page should display a section with the maps with the locations of the pokémon', () => {
  it('All from 14', () => {
    const { getByText, getAllByTestId } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    fireEvent.click(getByText('More details'));
    const locations = getByText(`Game Locations of ${pokemons[0].name}`);
    expect(locations).toBeInTheDocument();
    expect(locations.tagName).toEqual('H2');
    const divLocations = getAllByTestId('localiza');

    divLocations.forEach((location, index) => {
      const localizacao = getByText(pokemons[0].foundAt[index].location);
      const localizacaoimg = getAllByTestId('localiza-img')[index];
      expect(localizacao).toBeInTheDocument();
      expect(localizacaoimg).toBeInTheDocument();
      expect(localizacaoimg.src).toBe(pokemons[0].foundAt[index].map);
      expect(localizacaoimg.alt).toBe(`${pokemons[0].name} location`);
    });
  });
});

describe('15 - Details page should allow you to favor a pokémon', () => {
  it('Clicks on the checkbox must add and remove the pokémon from the list of favorites and its label must be favorite Pokémon', () => {
    const { getByText, getByRole } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    fireEvent.click(getByText('More details'));
    const checkbox = getByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBeFalsy();
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBeTruthy();
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBeFalsy();
    expect(checkbox.parentNode.tagName).toBe('LABEL');
    expect(checkbox.parentNode.innerHTML).toMatch('Pokémon favoritado?');
  });
});

describe('16 - Favorite Pokémon should display a star icon', () => {
  it('Icon must be an image, with the src attribute equal to /star-icon.svg', () => {
    const {
      getByText, getByRole, getAllByRole, getByLabelText,
    } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    fireEvent.click(getByText('More details'));
    const checkbox = getByRole('checkbox');

    let images = getAllByRole('img');

    let starred = images.some((imagem) => imagem.src === 'http://localhost/star-icon.svg');
    expect(starred).toBeFalsy();

    fireEvent.click(checkbox);
    images = getAllByRole('img');
    starred = images.some((imagem) => imagem.src === 'http://localhost/star-icon.svg');
    expect(starred).toBeTruthy();

    fireEvent.click(checkbox);
    images = getAllByRole('img');
    starred = images.some((imagem) => imagem.src === 'http://localhost/star-icon.svg');
    expect(starred).toBeFalsy();

    const favCheckbox = getByLabelText(/Pokémon favoritado?/i);
    expect(favCheckbox.checked).toBeFalsy();
    fireEvent.click(favCheckbox);
    expect(favCheckbox.checked).toBeTruthy();
  });

  it('Must have the alt attribute equal to is marked as favorite, where is the name of the pokémon displayed', () => {
    const {
      getByText, getByRole, getByTestId,
    } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    fireEvent.click(getByText('More details'));
    const checkbox = getByRole('checkbox');
    fireEvent.click(checkbox);

    const favImg = getByTestId('favorite-icon');
    expect(favImg).toBeInTheDocument();
    expect(favImg).toHaveAttribute('src', '/star-icon.svg');
    expect(favImg).toHaveAttribute('alt', 'Pikachu is marked as favorite');
  });
});

describe('17 - At the top of the application should be a fixed set of navigation links', () => {
  it('17', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    // First link must have the text Home with the URL /
    expect(getByText('Home', { selector: 'a' })).toBeInTheDocument();
    expect(getByText('Home').href).toBe('http://localhost/');
    // Second link must have the text About with the URL / about
    expect(getByText('About', { selector: 'a' })).toBeInTheDocument();
    expect(getByText('About').href).toBe('http://localhost/about');
    // Thirdlink deve must have the text Favorite Pokémons with the URL /favorites.
    expect(getByText('Favorite Pokémons', { selector: 'a' })).toBeInTheDocument();
    expect(getByText('Favorite Pokémons').href).toBe('http://localhost/favorites');
  });
});

describe('18 - ', () => {
  it('18', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    const homeBtn = getByText('Home', { selector: 'a' });
    fireEvent.click(homeBtn);
    expect(history.location.pathname).toBe('/');
  });
});

describe('19 - Clicking on the "About" link the app must be redirected to URL "/ about"', () => {
  it('19', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );

    const about = getByText('About', { selector: 'a' });
    fireEvent.click(about);
    expect(history.location.pathname).toBe('/about');
  });
});

describe('20 - When clicking on the link "Favorite Pokémons" in the navigation bar, the app must be redirected to the URL "/ favorites"', () => {
  it('20', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    const favoritesBtn = getByText('Favorite Pokémons', { selector: 'a' });
    fireEvent.click(favoritesBtn);
    expect(history.location.pathname).toBe('/favorites');
  });
});
