import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
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

describe('Test #1', () => {
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
});

describe('Test #17', () => {
  test('No topo da aplicação deve haver um conjunto fixo de links de navegação', () => {
    const { getAllByRole } = renderWithRouter(<App />);
    const links = getAllByRole('link');
    const mockLinks = ['/', '/about', '/favorites'];
    const mockLinkText = ['Home', 'About', 'Favorite Pokémons'];
    mockLinks.forEach((link, index) => {
      expect(links[index].innerHTML).toBe(mockLinkText[index]);
      expect(`http://localhost${link}`).toBe(links[index].href);
    });
  });
});

describe('Test #18', () => {
  test('Ao clicar no link "Home", a aplicação deve ser redirecionada para a página inicial, na URL "/"', () => {
    const { queryByText, history } = renderWithRouter(<App />);
    const homeLink = queryByText(/Home/i);

    expect(homeLink).toBeInTheDocument();

    fireEvent.click(homeLink);

    expect(history.location.pathname).toBe('/');
  });
});

describe('Test #19', () => {
  test('Ao clicar no link "About", a aplicação deve ser redirecionada para a página de About, na URL "/about"', () => {
    const { queryByText, history } = renderWithRouter(<App />);
    const aboutLink = queryByText(/About/i);

    expect(aboutLink).toBeInTheDocument();

    fireEvent.click(aboutLink);

    expect(history.location.pathname).toBe('/about');
  });
});

describe('Test #20', () => {
  test('Ao clicar no link "Favorite Pokémons", a aplicação deve ser redirecionada para a página de pokémons favoritados, na URL "/favorites"', () => {
    const { queryByText, history } = renderWithRouter(<App />);
    const favoritePokemonsLink = queryByText(/Favorite Pokémons/i);

    expect(favoritePokemonsLink).toBeInTheDocument();

    fireEvent.click(favoritePokemonsLink);

    expect(history.location.pathname).toBe('/favorites');
  });
});
