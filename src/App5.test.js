import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import {
  render, cleanup, fireEvent, waitForDomChange,
} from '@testing-library/react';
import App from './App';
import ResultLocation from './LocationsData';
import ResultLocationClick from './LocationData2';
import { Locations } from './components';

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
    expect(getByText('Next Page')).toBeInTheDocument();
    expect(getByText('Previous Page')).toBeInTheDocument();
    expect(history.location.pathname).toBe('/locations');
  });

  test('Locations results', async () => {
    const history = createMemoryHistory();
    const { queryByText } = render(
      <Router history={history}>
        <Locations />
      </Router>,
    );
    const fetch = jest
      .fn()
      .mockResolvedValue(ResultLocation);
    await waitForDomChange()
      .then(() => {
        fetch().then((resolve) => {
          resolve.forEach((element) => {
            expect(queryByText(element)).toBeInTheDocument();
          });
        });
      });
  });
  test('Locations click ', async () => {
    const history = createMemoryHistory();
    const { queryByText } = render(
      <Router history={history}>
        <Locations />
      </Router>,
    );
    const fetch = jest
      .fn()
      .mockResolvedValue(ResultLocationClick);
    await waitForDomChange()
      .then(async () => {
        fireEvent.click(queryByText('Next Page'));
        await waitForDomChange()
          .then(() => {
            fetch().then((resolve) => {
              resolve.forEach((element) => {
                expect(queryByText(element)).toBeInTheDocument();
              });
            });
          });
      });
    await fireEvent.click(queryByText('Previous Page'));
    await waitForDomChange()
      .then(() => {
        fetch().then((resolve) => {
          resolve.forEach((element) => {
            expect(queryByText(element)).not.toBeInTheDocument();
          });
        });
      });
  });
});
