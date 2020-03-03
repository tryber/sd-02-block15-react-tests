import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import App from './App';
import pokemons from './data2';

afterEach(cleanup);

describe('test', () => {
  test('At the top of the application, there should be a fixed set of navigation links', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    expect(getByText('Home').href).toBe('http://localhost/');
    expect(getByText('About').href).toBe('http://localhost/about');
    expect(getByText(/Favorite Pokémons/).href).toBe('http://localhost/favorites');
  });
  test('18, 19, 20', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    fireEvent.click(getByText('Home'));
    expect(history.location.pathname).toBe('/');
    fireEvent.click(getByText('About'));
    expect(history.location.pathname).toBe('/about');
    fireEvent.click(getByText(/Favorite Pokémons/));
    expect(history.location.pathname).toBe('/favorites');
  });
  test('21', () => {
    const history = createMemoryHistory();
    const {
      getByText, queryByText, getAllByTestId, getByAltText
    } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    fireEvent.click(getByText('About'));
    expect(queryByText('About Pokédex')).toBeInTheDocument();
    expect(queryByText('About Pokédex').tagName).toBe('H2');
    expect(getAllByTestId('paragrafo').length).toBe(2);
    expect(getByAltText('Pokédex')).toBeInTheDocument();
    expect(getByAltText('Pokédex').src).toBe('https://cdn.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png');

  });
});
