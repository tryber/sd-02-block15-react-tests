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
});
