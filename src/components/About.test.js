import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { cleanup, fireEvent, render } from '@testing-library/react';
import App from '../App';

afterEach(cleanup);

describe('Pokemon About.js tests', () => {
  test('21 - A página "About" deve exibir informações sobre a Pokédex', () => {
    const history = createMemoryHistory();
    const { queryByText, queryByAltText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    fireEvent.click(queryByText('About'));
    const page = '/about';
    expect(history.location.pathname).toBe(page);
    // A página deve conter um heading h2 com o texto About Pokédex
    expect(queryByText(/About Pokédex/i, { selector: 'h2' })).toBeInTheDocument();
    // A página deve conter dois parágrafos com texto sobre a Pokédex
    expect(queryByText(/This application simulates a Pokédex, a digital encliclopedia containing all Pokémons/i, { selector: 'p' })).toBeInTheDocument();
    expect(queryByText(/One can filter Pokémons by type, and see more details for each one of them/i, { selector: 'p' })).toBeInTheDocument();
    // A página deve conter a seguinte imagem de uma Pokédex
    const imageDex = 'https://cdn.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png';
    expect(queryByAltText('Pokédex')).toBeInTheDocument();
    expect(queryByAltText('Pokédex').src).toBe(imageDex);
  });
});
