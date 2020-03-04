import React from 'react';
import { cleanup } from '@testing-library/react';
import renderWithRouter from '../Renderwithrouter';
import App from '../App';

afterEach(cleanup);

describe('Test #23', () => {
  test('Entrar em uma URL desconhecida exibe a página Not Found', () => {
    const { getByText, getAllByRole } = renderWithRouter(<App />, {
      route: '/something-that-does-not-match',
    });
    const headingH2 = getByText(/Page requested not found/i);
    expect(headingH2).toBeInTheDocument();
    expect(headingH2.tagName).toBe('H2');

    const image = getAllByRole('img');
    expect(image[1]).toBeInTheDocument();
    expect(image[1].src).toBe('https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif')
  });
});
