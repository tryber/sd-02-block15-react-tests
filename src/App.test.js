import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, fireEvent } from '@testing-library/react';
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


test('render page Pokedex at URL "/"', () => {
  const history = createMemoryHistory();
  history.push('/');
  const { getByTestId } = render(
    <Router history={history}>
      <App />
    </Router>,
  );
  const page = getByTestId('page-pokedex');
  expect(page).toBeInTheDocument();
});

test('Should have links "/, "/about", "/favorites"', () => {
  const history = createMemoryHistory();
  history.push('/');
  const { container } = render(
    <Router history={history}>
      <App />
    </Router>,
  );
  const navs = container.querySelectorAll('nav > a');
  const hrefs = ['/', '/about', '/favorites'];
  let bool = true;
  navs.forEach((nav) => {
    if (!hrefs.find((href) => nav.getAttribute('href') === href)) {
      bool = false;
    }
  });
  expect(bool).toBeTruthy();
});


test('click "Home", "About" and "Favorite"', () => {
  const history = createMemoryHistory();
  history.push('/');
  const { container } = render(
    <Router history={history}>
      <App />
    </Router>,
  );
  const home = container.querySelectorAll('nav > a')[0];
  const about = container.querySelectorAll('nav > a')[1];
  const favorite = container.querySelectorAll('nav > a')[2];
  fireEvent.click(home);
  expect(history.location.pathname).toBe('/');

  history.push('/');
  fireEvent.click(about);
  expect(history.location.pathname).toBe('/about');

  history.push('/');
  fireEvent.click(favorite);
  expect(history.location.pathname).toBe('/favorites');
});

test('Not Found Page', () => {
  const history = createMemoryHistory();
  history.push('/desconhecido');
  const { getByTestId, getByText } = render(
    <Router history={history}>
      <App />
    </Router>,
  );
  const page = getByTestId('page-notfound');
  expect(page).toBeInTheDocument();
  expect(getByText('Page requested not found')).toBeInTheDocument();
  const src = page.querySelector('img').getAttribute('src');
  expect(src).toBe('https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif');
});
