import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import App from './App';
import renderWithRouter from './Renderwithrouter';

test('renders a reading with the text `Pokédex`', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const heading = getByText(/Pokédex/i);
  expect(heading).toBeInTheDocument();
});

test('renders a reading with the text `Pokedex`', () => {
  const { getByText } = renderWithRouter(<App />);
  expect(getByText(/Pokédex/)).toBeInTheDocument();
});

test('shows the Pokedéx when the route is `/`', () => {
  const route = '/';
  const { getByText } = renderWithRouter(<App />, { route });
  const text = getByText(/Favorite Pokémons/i);
  expect(text).toBeInTheDocument();
});

test('shows the Pokedéx when the route is `/`', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );

  expect(getByText('Encountered pokémons')).toBeInTheDocument();
});
