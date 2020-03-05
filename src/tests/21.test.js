import React from 'react';
import { cleanup } from '@testing-library/react';
import renderWithRouter from '../services/renderWithRouter';
import About from '../components/About';

afterEach(cleanup);

describe('21.', () => {
  test('Pokedex about page have a pokedex image, two paragraphs and H2 tag', () => {
    const { queryByText, queryByAltText, queryAllByTestId } = renderWithRouter(<About />);
    const aboutTitle = queryByText(/About Pokédex/i);
    expect(aboutTitle).toBeInTheDocument();
    expect(aboutTitle.tagName).toBe('H2');

    const pokedexImage = queryByAltText(/Pokédex/i);
    const pokedexLinkImage = 'https://cdn.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png';
    expect(pokedexImage).toBeInTheDocument();
    expect(pokedexImage.src).toBe(pokedexLinkImage);

    const paragraphsIdTests = queryAllByTestId('paragraph-test');
    paragraphsIdTests.forEach((paragraph) => {
      expect(paragraph).toBeInTheDocument();
    });
  });
});
