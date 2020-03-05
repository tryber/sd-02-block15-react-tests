import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

afterEach(cleanup);

describe('19.', () => {
  test('When clicked in About text, the route is changed to about page (/about)', () => {
    const { queryByText, history } = renderWithRouter(<App />);
    const aboutButton = queryByText(/About/i);
    expect(history.location.pathname).toBe('/');
    fireEvent.click(aboutButton);
    expect(history.location.pathname).toBe('/about');
  });
});
