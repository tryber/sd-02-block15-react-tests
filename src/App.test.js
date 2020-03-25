import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import renderWithRouter from './RenderWithRouter';
import App from './App';
import { Pokedex, FavoritePokemons } from './components';
import pokemons from './mockData';

afterEach(cleanup);

const isPokemonFavoriteById = {
  25: true,
  4: true,
  10: true,
  23: false,
  65: true,
  151: true,
  78: false,
  143: true,
  148: false,
};

const allTypes = pokemons.map(({ type }) => type);
const pokemonTypes = allTypes.filter((item, index, array) => array.indexOf(item) === index);
const pokemonNames = pokemons.map(({ name }) => name);

describe('test 1 - shows pokedex in main page', () => {
  it('1.1 - renders a heading with the text `Pokédex`', () => {
    const { getByText } = renderWithRouter(<App />);
    const heading = getByText(/Pokédex/i);
    expect(heading).toBeInTheDocument();
  });

  it('1.2 - shows the Pokedéx when the route is `/`', () => {
    const { getByText } = renderWithRouter(<App />);
    expect(
      getByText('Encountered pokémons'),
    ).toBeInTheDocument();
  });
});

describe('test 2 - only one pokemon each page', () => {
  it('2.0 - shows only one pokemon at once', () => {
    const { getAllByText } = renderWithRouter(<App />);
    expect(getAllByText(/more details/i).length).toBe(1);
    expect(getAllByText(/more details/i)[1]).toBeUndefined();
  });
});

describe('test 3 - next button shows next pokemon', () => {
  it("3.1 - button must contain 'proximo pokemon'", () => {
    const { getByText } = renderWithRouter(<App />);
    expect(getByText(/próximo pokémon/i)).toBeInTheDocument();
  });
  it('3.2 - multiple clicks must show next pokemon', () => {
    const { getByText } = renderWithRouter(<App />);
    const nextButton = getByText(/próximo pokémon/i);
    pokemonNames.forEach((pokemon) => {
      expect(getByText(pokemon)).toBeInTheDocument();
      fireEvent.click(nextButton);
    });
  });
  it('3.3 - after last pokémon must return to the first one', () => {
    const { getByText } = renderWithRouter(<App />);
    const nextButton = getByText(/próximo pokémon/i);
    pokemonNames.forEach(() => fireEvent.click(nextButton));
    expect(getByText(pokemonNames[0])).toBeInTheDocument();
  });
});
describe('Test 4 - pokédex must contain filter buttons', () => {
  it('4.1 - button type must select only pokemons of that type', () => {
    const { getByText, getAllByText } = renderWithRouter(<App />);
    const nextButton = getByText(/Próximo pokémon/i);
    pokemonTypes.forEach((type) => {
      const typeButton = getAllByText(type)[1] || getByText(type);
      fireEvent.click(typeButton);
      const clickedPokemon = pokemons.filter((e) => e.type === type);
      clickedPokemon.forEach((pokemonType) => {
        expect(getByText(pokemonType.name)).toBeInTheDocument();
        if (clickedPokemon.length > 1) fireEvent.click(nextButton);
      });
    });
  });
  it("4.2 - button label must be igual 'type'", () => {
    const { getAllByText, getByText } = renderWithRouter(<App />);
    pokemonTypes.forEach((type) => {
      const typeButton = getAllByText(type)[1] || getByText(type);
      expect(typeButton).toBeInTheDocument();
      expect(typeButton).toHaveTextContent(type);
      expect(typeButton).toHaveAttribute('type', 'button');
    });
  });
  describe('Test 5 - pokedex must contain button to reset filter', () => {
    it("5.1 - button label must be 'all'", () => {
      const { getByText } = renderWithRouter(<App />);
      const allButton = getByText(/all/i);
      expect(allButton).toBeInTheDocument();
      expect(allButton).toHaveTextContent(/all/i);
      expect(allButton).toHaveAttribute('type', 'button');
    });
    it('5.2 - click must select all pokemons', () => {
      const { getByText } = renderWithRouter(<App />);
      const allButton = getByText(/all/i);
      const nextButton = getByText(/próximo pokémon/i);
      fireEvent.click(allButton);
      pokemonNames.forEach((pokemonName) => {
        expect(getByText(pokemonName)).toBeInTheDocument();
        fireEvent.click(nextButton);
      });
      expect(getByText(pokemonNames[0])).toBeInTheDocument();
    });
    it('5.3 - first page must load filter all', () => {
      const { getByText } = renderWithRouter(<App />);
      const nextButton = getByText(/próximo pokémon/i);
      pokemonNames.forEach((pokemonName) => {
        expect(getByText(pokemonName)).toBeInTheDocument();
        fireEvent.click(nextButton);
      });
      expect(getByText(pokemonNames[0])).toBeInTheDocument();
    });
  });
  describe('test 6 - pokedex must render a button filter to each type of pokemon', () => {
    it('6.1 - checking if all types were rendered', () => {
      const { getByText, getAllByText } = renderWithRouter(<App />);
      pokemonTypes.forEach((type) => {
        const typeButton = getAllByText(type)[1] || getByText(type);
        expect(typeButton).toBeInTheDocument();
      });
      expect(getByText(/all/i)).toBeInTheDocument();
    });
  });
  describe('test 7 - next button must be disabled if theres only one pokemon', () => {
    test('7.1 - disable next button', () => {
      const { getByText, getAllByText } = renderWithRouter(<App />);
      const nextButton = getByText(/próximo pokémon/i);
      const repeatedPokemons = allTypes.filter((item, index, array) => array.indexOf(item) !== index);
      const uniquePokemons = pokemonTypes.filter((pokemon) => !(repeatedPokemons).includes(pokemon));
      uniquePokemons.forEach((uniquePokemon) => {
        const uniqueButton = getAllByText(uniquePokemon)[1] || getByText(uniquePokemon);
        fireEvent.click(uniqueButton);
        expect(nextButton).toBeDisabled();
      });
    });
  });
  describe('Test 8 - pokedex must display name, type, weight and image', () => {
    it("8.1 - Average weight must has the form 'Average weight: <value> <measurementUnit>'", () => {
      const { getByText, getAllByText } = renderWithRouter(<App />);
      const nextButton = getByText(/próximo pokémon/i);
      pokemons.forEach(({ name, type, averageWeight: { value, measurementUnit } }) => {
        expect(getByText(name)).toBeInTheDocument();
        expect(getAllByText(type)[0]).toBeInTheDocument();
        expect(getByText(`Average weight: ${value} ${measurementUnit}`)).toBeInTheDocument();
        fireEvent.click(nextButton);
      });
    });
    it('8.2 - Image must have src with URL and alt with pokemon name', () => {
      const { getByAltText, getByText } = renderWithRouter(<App />);
      const nextButton = getByText(/próximo pokémon/i);
      pokemons.forEach(({ name, image }) => {
        const pokemonImage = getByAltText(`${name} sprite`);
        expect(pokemonImage).toBeTruthy();
        expect(pokemonImage.src).toBe(image);
        fireEvent.click(nextButton);
      });
    });
    describe('Test 9 - pokémon must contain link to show details', () => {
      it("9.1 - link must be direct to '/pokemon/<id>'", () => {
        const { getByText } = renderWithRouter(<App />);
        const nextButton = getByText(/próximo pokémon/i);
        pokemons.forEach(({ id }) => {
          const detailsButton = getByText(/more details/i);
          expect(detailsButton).toBeInTheDocument();
          expect(detailsButton.href).toMatch(`http://localhost/pokemons/${id}`);
          fireEvent.click(nextButton);
        });
      });
    });
    describe('Test 10 - click more details should redirect page', () => {
      it('10.1 - should redirect and change to URL /pokemon/id ', () => {
        const { getByText, history } = renderWithRouter(<App />);
        const detailsButton = getByText(/more details/i);
        expect(getByText(detailsButton.innerHTML)).toBeInTheDocument();
        let URL = history.location.pathname;
        const { id } = pokemons[0];
        expect(URL).toMatch('/');
        fireEvent.click(detailsButton);
        URL = history.location.pathname;
        expect(URL).toBe(`/pokemons/${id}`);
      });
    });
    describe('Test 11 - pokemon details should display name, type, weight and image', () => {
      it('11.1 - pokemon details should display average weight: value measurement unit and 11.2 - img must has src with URL image', () => {
        const { getByText, getByAltText } = renderWithRouter(<App />);
        pokemons.forEach(({
          name, type, averageWeight: { value, measurementUnit }, image,
        }, index) => {
          for (let i = 0; i < index; i += 1) {
            const nextButton = getByText(/próximo pokémon/i);
            fireEvent.click(nextButton);
          }
          fireEvent.click(getByText(/details/i));
          expect(getByText(name)).toBeInTheDocument();
          expect(getByText(type)).toBeInTheDocument();
          expect(getByText(`Average weight: ${value} ${measurementUnit}`)).toBeInTheDocument();
          expect(getByAltText(`${name} sprite`)).toBeTruthy();
          expect(getByAltText(`${name} sprite`)).toHaveAttribute('src', image);
          fireEvent.click(getByText(/home/i));
        });
      });
    });
    describe('Test 12 - detailed pokemon must not contain link to show details', () => {
      it('12.1 - shall not has details button on page', () => {
        const { getByText, queryByText } = renderWithRouter(<App />);
        for (let i = 0; i < pokemons.length; i += 1) {
          fireEvent.click(getByText(/more details/i));
          expect(queryByText(/more details/i)).toBeNull();
          fireEvent.click(getByText(/home/i));
          for (let j = 0; j < i; j += 1) {
            fireEvent.click(getByText(/próximo pokémon/i));
          }
        }
      });
    });
    describe('Test 13 - detailed pokemon should display pokemon summary', () => {
      it('13.1 - pokemon details must contain heading h2 and 13.2 - text summary', () => {
        const { getByText, queryByText } = renderWithRouter(<App />);
        pokemons.forEach(({
          name, type, averageWeight: { value, measurementUnit }, image, summary, foundAt,
        }, index) => {
          for (let i = 0; i < index; i += 1) {
            const nextButton = getByText(/Próximo pokémon/i);
            fireEvent.click(nextButton);
          }
          const detailsButton = queryByText(/More details/i);
          fireEvent.click(detailsButton);
          expect(getByText('Summary')).toBeInTheDocument();
          expect(getByText('Summary').tagName).toBe('H2');
          expect(getByText(summary)).toBeInTheDocument();
          expect(getByText(summary).tagName).toBe('P');
          fireEvent.click(getByText('Home'));
        });
      });
    });
    });
  });

