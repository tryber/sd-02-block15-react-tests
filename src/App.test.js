import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import {
  render, cleanup, fireEvent, getAllByAltText, getByAltText,
} from '@testing-library/react';
import App from './App';
import { Pokedex, FavoritePokemons } from './components';
import pokemons from './mockData';
import { pokemonType } from './types';

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

const pokemonNames = pokemons.map(({ name }) => name);
const allTypes = pokemons.map(({ type }) => type);
const pokemonTypes = allTypes.filter((item, index, array) => array.indexOf(item) === index);

describe('test 1 - shows pokedex in main page', () => {
  it('1.1 - renders a heading with the text `Pokédex`', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const heading = getByText(/Pokédex/i);
    expect(heading).toBeInTheDocument();
  });

  it('1.2 - shows the Pokedéx when the route is `/`', () => {
    const { getByText } = render(
      <MemoryRouter
        initialEntries={['/']}
      >
        <App />
      </MemoryRouter>,
    );

    expect(
      getByText('Encountered pokémons'),
    ).toBeInTheDocument();
  });
});

describe('test 2 - only one pokemon each page', () => {
  it('2.0 - shows only one pokemon at once', () => {
    const { getAllByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(getAllByText(/more details/i).length).toBe(1);
    expect(getAllByText(/more details/i)[1]).toBeUndefined();
  });
});

describe('test 3 - next button shows next pokemon', () => {
  it("3.1 - button must contain 'proximo pokemon'", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(getByText(/próximo pokémon/i)).toBeInTheDocument();
  });
  it('3.2 - multiple clicks must show next pokemon', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
      </MemoryRouter>,
    );
    const nextButton = getByText(/próximo pokémon/i);
    pokemonNames.forEach((pokemon) => {
      expect(getByText(pokemon)).toBeInTheDocument();
      fireEvent.click(nextButton);
    });
  });
  it('3.3 - after last pokémon must return to the first one', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
      </MemoryRouter>,
    );
    const nextButton = getByText(/próximo pokémon/i);
    pokemonNames.forEach(() => fireEvent.click(nextButton));
    expect(getByText(pokemonNames[0])).toBeInTheDocument();
  });
});
describe('Test 4 - pokédex must contain filter buttons', () => {
  it('4.1 - button type must select only pokemons of that type', () => {
    const { getByText, getAllByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
      </MemoryRouter>,
    );
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
    const { getAllByText, getByText } = render(
      <MemoryRouter inicialEntries={['/']}>
        <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
      </MemoryRouter>,
    );
    pokemonTypes.forEach((type) => {
      const typeButton = getAllByText(type)[1] || getByText(type);
      expect(typeButton).toBeInTheDocument();
      expect(typeButton).toHaveTextContent(type);
      expect(typeButton).toHaveAttribute('type', 'button');
    });
  });
  describe('Test 5 - pokedex must contain button to reset filter', () => {
    it("5.1 - button label must be 'all'", () => {
      const { getByText } = render(
        <MemoryRouter inicialEntries={['/']}>
          <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
        </MemoryRouter>,
      );
      const allButton = getByText(/all/i);
      expect(allButton).toBeInTheDocument();
      expect(allButton).toHaveTextContent(/all/i);
      expect(allButton).toHaveAttribute('type', 'button');
    });
    it('5.2 - click must select all pokemons', () => {
      const { getByText } = render(
        <MemoryRouter initialEntries={['/']}>
          <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
        </MemoryRouter>,
      );
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
      const { getByText } = render(
        <MemoryRouter initialEntries={['/']}>
          <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
        </MemoryRouter>,
      );
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
      const { getByText, getAllByText } = render(
        <MemoryRouter inicialEntries={['/']}>
          <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
        </MemoryRouter>,
      );
      pokemonTypes.forEach((type) => {
        const typeButton = getAllByText(type)[1] || getByText(type);
        expect(typeButton).toBeInTheDocument();
      });
      expect(getByText(/all/i)).toBeInTheDocument();
    });
  });
  describe('test 7 - next button must be disabled if theres only one pokemon', () => {
    test('7.1 - disable next button', () => {
      const { getByText, getAllByText } = render(
        <MemoryRouter inicialEntries={['/']}>
          <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
        </MemoryRouter>,
      );
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
      const { getByText, getAllByText } = render(
        <MemoryRouter initialEntries={['/']}>
          <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
        </MemoryRouter>,
      );
      const nextButton = getByText(/próximo pokémon/i);
      pokemons.forEach(({ name, type, averageWeight: { value, measurementUnit } }) => {
        expect(getByText(name)).toBeInTheDocument();
        expect(getAllByText(type)[0]).toBeInTheDocument();
        expect(getByText(`Average weight: ${value} ${measurementUnit}`)).toBeInTheDocument();
        fireEvent.click(nextButton);
      });
    });
    it('8.2 - Image must have src with URL and alt with pokemon name', () => {
      const { getByAltText, getByText } = render(
        <MemoryRouter initialEntries={['/']}>
          <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
        </MemoryRouter>,
      );
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
        const { getByText } = render(
          <MemoryRouter initialEntries={['/']}>
            <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
          </MemoryRouter>,
        );
        const nextButton = getByText(/próximo pokémon/i);
        pokemons.forEach(({ id }) => {
          const detailsButton = getByText(/more details/i);
          expect(detailsButton).toBeInTheDocument();
          expect(detailsButton.href).toBe(`http://localhost/pokemons/${id}`);
          fireEvent.click(nextButton);
        });
      });
    });
  });
});
