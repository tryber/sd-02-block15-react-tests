import React from 'react';
import { cleanup } from '@testing-library/react';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

afterEach(cleanup);

test('renders a reading with the text `Pokédex`', () => {
  const { getByText } = renderWithRouter(<App />);
  const heading = getByText(/Encountered pokémons/i);
  expect(heading).toBeInTheDocument();
});
