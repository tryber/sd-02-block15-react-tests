import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import App from '../App';

test('2 - Pokedex shows only one pokemon each time', () => {
  const { getAllByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const moreDetailLength = getAllByText('More details').length;
  expect(moreDetailLength).toBe(1);
});
