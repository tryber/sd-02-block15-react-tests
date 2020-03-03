import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import App from '../App';

describe('testing Pokedex functionalities', () => {
  it('02 - test if pokedex shows 1 pokemon at a time', () => {
    const { queryAllByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    console.log(queryAllByText(/Average weight/))
    expect(queryAllByText(/Average weight/).length).toBe(1);
  });
});
