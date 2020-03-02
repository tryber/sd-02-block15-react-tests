import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import renderWithRouter from '../services/renderWithRouter';
import App from '../App';

afterEach(cleanup);

describe('7.', () => {
  test('Disable the Next button when the pokemon type has only one species', () => {
    const { getAllByText, getByText } = renderWithRouter(<App />);
    const nextButton = getByText(/Próximo pokémon/i);
    const allButton = getByText(/All/i);
    const electricButton = getAllByText('Electric')[1] || getByText('Electric');
    const bugButton = getAllByText('Bug')[1] || getByText('Bug');
    expect(electricButton.tagName).toBe('BUTTON');
    expect(bugButton.tagName).toBe('BUTTON');
    fireEvent.click(electricButton);
    expect(nextButton.disabled).toBeTruthy();
    fireEvent.click(bugButton);
    expect(nextButton.disabled).toBeTruthy();
    fireEvent.click(allButton);
    expect(nextButton.disabled).toBeFalsy();
  });
});
