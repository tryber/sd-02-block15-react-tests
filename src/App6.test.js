import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import {
  render, cleanup, fireEvent, waitForDomChange,
} from '@testing-library/react';
import App from './App';
import Info from './GenerationInfodata';

afterEach(cleanup);

const generations = [
  'generation-i',
  'generation-ii',
  'generation-iii',
  'generation-iv',
  'generation-v',
  'generation-vi',
  'generation-vii',
];
describe(' Test Generation', () => {
  test(' Basic ', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    expect(getByText('Generations')).toBeInTheDocument();
    expect(getByText('Generations').href).toBe('http://localhost/generations');
    fireEvent.click(getByText('Generations'));
    expect(history.location.pathname).toBe('/generations');
  });
  test('Mock Generation', async () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    fireEvent.click(getByText('Generations'));
    const fetch = jest
      .fn()
      .mockResolvedValue(generations);
    await waitForDomChange()
      .then(() => {
        fetch().then((resolve) => {
          resolve.forEach((gene, index) => {
            expect(getByText(gene)).toBeInTheDocument();
            expect(getByText(gene).href).toBe(`http://localhost/generations/${index + 1}`);
          });
        });
      });
  });
  test('Generation info', async () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    fireEvent.click(getByText('Generations'));
    const fetch = jest
      .fn()
      .mockResolvedValue(generations);
    const fetch2 = jest
      .fn()
      .mockResolvedValue(Info);
    await waitForDomChange()
      .then(async () => {
        await fetch().then(async (resolve) => {
          fireEvent.click(getByText(resolve[0]));
          await waitForDomChange()
            .then(async () => {
              await fetch2().then((resolv) => {
                resolv.forEach((ele) => expect(getByText(ele)).toBeInTheDocument());
              });
            });
        });
      });
  });
});
