import React from 'react';
import { cleanup } from '@testing-library/react';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

afterEach(cleanup);

describe('2.', () => {
  test('Pokedex shows just one pokemon at a time', () => {
    const { getAllByText } = renderWithRouter(<App />);
    const weight = getAllByText(/Average weight:/i);
    expect(weight.length).toBe(1);
  });
});
