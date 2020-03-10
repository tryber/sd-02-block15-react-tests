import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { cleanup, render } from '@testing-library/react';
import App from '../App';

afterEach(cleanup);

describe('Pokemon NotFound.js tests', () => {
  test('23 - Entrar em uma URL desconhecida exibe a página Not Found', () => {
    const history = createMemoryHistory();
    const { queryByText, queryByLabelText, queryByAltText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    history.push('/unknown');
    // A página deve conter um heading h2 com o texto Page requested not found
    expect(queryByText('Page requested not found', { selector: 'h2' })).toBeInTheDocument();
    expect(queryByLabelText('Crying emoji')).toBeInTheDocument();
    // A página deve exibir a imagem https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif
    const cryingPikachuSrc = 'https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif';
    const cryingPikachuAltText = 'Pikachu crying because the page requested was not found';
    expect(queryByAltText(cryingPikachuAltText).src).toBe(cryingPikachuSrc);
    expect(queryByAltText(cryingPikachuAltText)).toBeInTheDocument();
  });
});
