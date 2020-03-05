import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import App from './App';

afterEach(cleanup);

test('renders a reading with the text `Pokédex`', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const heading = getByText(/Pokédex/i);
  expect(heading).toBeInTheDocument();
});

test('shows the Pokedéx when the route is `/`', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );

  expect(getByText('Encountered pokémons')).toBeInTheDocument();
});

describe('17 - At the top of the application, there should be a fixed set of navigation links', () => {
  it('The first link must have the text Home with the URL /', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    expect(getByText('Home', { selector: 'a' })).toBeInTheDocument();
    expect(getByText('Home').href).toBe('http://localhost/');
  });

  it('The second link must have the text About with the URL / about', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(getByText('About', { selector: 'a' })).toBeInTheDocument();
    expect(getByText('About').href).toMatch('/about');
  });

  it('The third link must have the text Favorite Pokémons with the URL / favorites', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(getByText('Favorite Pokémons', { selector: 'a' })).toBeInTheDocument();
    expect(getByText('Favorite Pokémons').href).toMatch('/favorites');
  });
});

describe('requisitos 18, 19 e 20', () => {
  it('When clicking on the "Home" link in the navigation bar, the application must be redirected to the home page, at the URL "/"', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    fireEvent.click(getByText('Home'));
    expect(history.location.pathname).toBe('/');
  });

  it('When clicking on the "About" link in the navigation bar, the application should be redirected to the About page, at the URL "/ about"', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    fireEvent.click(getByText('About'));
    expect(history.location.pathname).toBe('/about');
  });

  it('When clicking on the "Favorite Pokémons" link in the navigation bar, the application must be redirected to the favorite Pokémon page, at the URL "/ favorites"', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    fireEvent.click(getByText('Favorite Pokémons'));
    expect(history.location.pathname).toBe('/favorites');
  });
});
