import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import renderWithRouter from '../Renderwithrouter';
import App from '../App';

afterEach(cleanup);

describe('Test #21', () => {
  test('A página "About" deve exibir informações sobre a Pokédex', () => {
    const { queryByText } = renderWithRouter(<App />);
    const linkAbout = queryByText(/About/i);

    expect(linkAbout).toBeInTheDocument();

    fireEvent.click(linkAbout);

    const headingH2 = queryByText(/About Pokédex/i);
    expect(headingH2).toBeInTheDocument();
    expect(headingH2.tagName).toBe('H2');

    const description = headingH2.nextSibling;
    let tagPLength = 0;
    description.childNodes.forEach((element) => {
      if (element.tagName === 'P') {
        tagPLength += 1;
        expect(element.tagName).toBe('P');
      } else {
        expect(element.tagName).toBe('IMG');
        expect(element.src).toBe('https://cdn.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png');
      }
    });
    expect(tagPLength).toEqual(2);
  });
});
