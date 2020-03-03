import React from 'react';
import { createMemoryHistory } from 'history';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import App from './App';
import pokemons from './data2';

afterEach(cleanup);

describe('test', () => {
  test('At the top of the application, there should be a fixed set of navigation links', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(getByText('Home').href).toBe('http://localhost/');
    expect(getByText('About').href).toBe('http://localhost/about');
    expect(getByText(/Favorite Pokémons/).href).toBe('http://localhost/favorites');
  });
});
