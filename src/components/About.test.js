import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';

afterEach(cleanup);

describe('21 - The "About" page should display information about Pokédex', () => {
  it('The page must contain a h2 heading with the text About Pokédex', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    fireEvent.click(getByText(/About/i));
    const about = getByText(/About Pokédex/i, { selector: 'h2' });
    expect(about).toBeInTheDocument();
  });

  it('The page must contain two paragraphs with text about Pokédex', () => {
    const { getByText, getAllByTestId } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    fireEvent.click(getByText(/About/i));
    const aboutParagraphs = getAllByTestId('aboutP');
    expect(aboutParagraphs.length).toBe(2);
  });

  it('The page should contain the following image of a Pokédex: https://cdn.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png', () => {
    const { getByText, getByAltText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    fireEvent.click(getByText(/About/i));
    const pokedexImage = getByAltText('Pokédex');
    expect(pokedexImage.src).toBe('https://cdn.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png');
  });
});
