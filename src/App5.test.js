import React from 'react';
import { createMemoryHistory } from 'history';
import { Router, MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import App from './App';


afterEach(cleanup);

describe('Bonus', () => {
  test('Locations Link', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    expect(getByText('Locations')).toBeInTheDocument();
    expect(getByText('Locations').href).toBe('http://localhost/locations');
    fireEvent.click(getByText('Locations'));
    expect(history.location.pathname).toBe('/locations');
    expect(getByText('Generations')).toBeInTheDocument();
    expect(getByText('Generations').href).toBe('http://localhost/generations');
    fireEvent.click(getByText('Generations'));
    expect(history.location.pathname).toBe('/generations');
  });
});
