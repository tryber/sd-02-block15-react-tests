import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

describe('18.', () => {
  test('When clicked home text, the page goes to home page (/)', () => {
    const { queryByText, history } = renderWithRouter(<App />);
    const homeText = queryByText(/Home/i);
    expect(history.location.pathname).toBe('/');
    fireEvent.click(homeText);
    expect(history.location.pathname).toBe('/');
  });
});
