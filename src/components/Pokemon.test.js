import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import App from '../App';
import pokemonsMock from '../services/mockPkmnData';

afterEach(cleanup);

describe('Pokemon Pokemon.js tests', () => {
  test('8 - A Pokedéx deve exibir o nome, tipo, peso médio e imagem do pokémon exibido', () => {
    const { getByText, getByAltText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextBtn = getByText(/Próximo pokémon/i);
    expect(nextBtn).toBeInTheDocument();
    pokemonsMock.forEach(({ name, image, averageWeight }) => {
      const { value, measurementUnit } = averageWeight;
      const weightText = getByText(`Average weight: ${value} ${measurementUnit}`);
      const imageAlt = `${name} sprite`;
      const imageElem = getByAltText(imageAlt);
      const imageSrc = image;
      // O peso médio do pokémon deve ser exibido com um texto no formato...
      expect(weightText).toBeInTheDocument();
      // A imagem deve conter um atributo src com a URL da imagem do pokémon...
      expect(imageElem).toBeInTheDocument();
      expect(imageElem.src).toBe(imageSrc);
      fireEvent.click(nextBtn);
    });
  });

  test('9 - O pokémon exibido na Pokedéx deve conter um link de navegação para exibir detalhes deste pokémon', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextBtn = getByText(/Próximo pokémon/i);
    expect(nextBtn).toBeInTheDocument();
    const moreDetails = getByText(/More details/i);
    expect(moreDetails).toBeInTheDocument();
    pokemonsMock.forEach(({ id }) => {
      const link = `http://localhost/pokemons/${id}`;
      expect(moreDetails.href).toBe(link);
      fireEvent.click(nextBtn);
    });
  });
});
