import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
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

test('01 - shows the Pokedéx when the route is `/`', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );

  expect(getByText('Encountered pokémons')).toBeInTheDocument();
});


test('17 - At top of the app, it should have fixed links', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );
  const home = getByText('Home');
  expect(home).toBeInTheDocument();
  expect(home.href).toBe('http://localhost/');
  const about = getByText('About');
  expect(about).toBeInTheDocument();
  expect(about.href).toBe('http://localhost/about');
  const favPokemons = getByText('Favorite Pokémons');
  expect(favPokemons).toBeInTheDocument();
  expect(favPokemons.href).toBe('http://localhost/favorites');
});

function renderWithRouter(
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {},
) {
  const Wrapper = ({ children }) => (
    <Router history={history}>{children}</Router>
  );
  return {
    ...render(ui, { wrapper: Wrapper }),
    history,
  };
}

test('18, 19 and 20 - testing header links', () => {
  const { getByText, history } = renderWithRouter(
    <App />,
  );
  fireEvent.click(getByText('Home'));
  expect(history.location.pathname).toBe('/');
  fireEvent.click(getByText('About'));
  expect(history.location.pathname).toBe('/about');
  fireEvent.click(getByText('Favorite Pokémons'));
  expect(history.location.pathname).toBe('/favorites');
});

describe('21 - Page about should have Pokedez infos', () => {
  test('21.1 - must contain a heading with text "About Pokédex"', () => {
    const { getByText } = renderWithRouter(<App />, {
      route: '/about',
    });
    expect(getByText('About Pokédex')).toBeInTheDocument();
    expect(getByText('About Pokédex').tagName).toBe('H2');
  });
  test('21.2 - The About Page should have two paragraphs', () => {
    const { getByText } = renderWithRouter(<App />, {
      route: '/about',
    });
    expect(getByText(/This application simulates a Pokédex, a digital encliclopedia containing all Pokémons/)).toBeInTheDocument();
    expect(getByText(/One can filter Pokémons by type, and see more details for each one of them/)).toBeInTheDocument();
  });
  test('21.3 - Getting the right img path', () => {
    const { getByAltText } = renderWithRouter(<App />, {
      route: '/about',
    });
    expect(getByAltText('Pokédex').src).toBe('https://cdn.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png');
  });
});
