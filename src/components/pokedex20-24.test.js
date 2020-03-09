import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Router, MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import App from '../App';

afterEach(cleanup);

describe('21 -"About" page should display information about Pokédex', () => {
  it('21 - The page must contain an heading h2 with the text About Pokédex', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    fireEvent.click(getByText('About'));

    const headingH2 = getByText('About Pokédex');
    expect(headingH2).toBeInTheDocument();
    expect(headingH2.tagName).toBe('H2');
  });
  it('The page must contain two paragraphs with text about Pokédex', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    fireEvent.click(getByText('About'));
    expect(document.getElementsByTagName('p').length).toBe(2);
  });
  it('The page should contain the following image of a Pokédex(link)', () => {
    const { getByText, getByRole } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    fireEvent.click(getByText('About'));

    const pokeImage = getByRole('img');
    expect(pokeImage).toBeInTheDocument();
    expect(pokeImage.src).toEqual('https://cdn.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png');
  });
});

describe('22 - Favorite pokemon page should display favorite pokémons', () => {
  it('Must display all favored Pokémon + must not display any non-favored Pokémon.', () => {
    const { getByText, getByTestId, getByLabelText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    fireEvent.click(getByText('More details'));
    const favBtn = getByTestId('favorite-button');
    expect(getByLabelText('Pokémon favoritado?')).toBeInTheDocument();
    expect(favBtn).toBeInTheDocument();
    fireEvent.click(favBtn);
    const favorites = getByText('Favorite Pokémons', { selector: 'a' });
    fireEvent.click(favorites);
    expect(getByText('Pikachu')).toBeInTheDocument();
  });
});

describe('23 - Entering an unknown URL displays the Not Found page', () => {
  it('must contain a heading h2 with the text Page requested not found + must display the image https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif', () => {
    const { getByText, getByAltText } = render(
      <MemoryRouter initialEntries={['/digimon']}>
        <App />
      </MemoryRouter>,
    );
    const notFound = getByText(/Page requested not found/);
    expect((notFound).closest('h2'));
    expect(notFound).toBeInTheDocument();
    const pikachuGif = getByAltText('Pikachu crying because the page requested was not found');
    expect(pikachuGif).toBeInTheDocument();
  });
});

// describe('24 - Test coverage must be 100%', () => {
//   it('execute the command npm run test-coverage on the terminal', () => {
//   });
// });
