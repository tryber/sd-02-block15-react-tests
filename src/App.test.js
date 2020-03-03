import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { render, getAllByText, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import App from './App';

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
