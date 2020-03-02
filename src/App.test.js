import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
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
