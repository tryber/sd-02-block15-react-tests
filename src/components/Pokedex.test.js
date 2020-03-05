import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import pokemons from '../services/pokemons';
import App from '../App';

afterEach(cleanup);

test('2 - Pokedéx must show ONLY ONE Pokémon at a time', () => {
  const { queryAllByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const weight = queryAllByText(/Average weight:/i);

  expect(weight.length).toBe(1);
});

describe('3 - Testing "Próximo pokémon" button', () => {
  it('3 - When pressing the next button, the page should display the next pokémon in the list', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonBtn = getByText(/Próximo pokémon/);

    pokemons.forEach(({ name }) => {
      expect(getByText(name)).toBeInTheDocument();
      fireEvent.click(nextPokemonBtn);
    });
  });

  it('The button should contain the text "Próximo Pokémon', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonBtn = getByText(/Próximo pokémon/);

    expect(nextPokemonBtn).toBeInTheDocument();
    expect(nextPokemonBtn.tagName).toBe('BUTTON');
  });

  it('Upon reaching the last Pokémon on the list, the Pokédex must return to the first Pokémon at the press of the button', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonBtn = getByText(/Próximo pokémon/);

    pokemons.forEach(() => fireEvent.click(nextPokemonBtn));
    expect(getByText(pokemons[0].name)).toBeInTheDocument();
  });
});

describe('4 - The Pokédex must contain filter buttons', () => {
  it('when type of pokemon is selected, pokedex must show only the respective pokemons', () => {
    const { getByTestId, getAllByText, getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonBtn = getByText(/Próximo pokémon/);
    pokemons.forEach(({ type }) => {
      expect(getByTestId(type)).toBeInTheDocument();
      fireEvent.click(getByTestId(type));
      expect(getAllByText(type).length).toEqual(2);
      const pokemonsTypes = pokemons.filter((pokemon) => pokemon.type === type);
      pokemonsTypes.forEach((pokemon) => {
        expect(getByText(pokemon.name)).toBeInTheDocument();
        if (pokemonsTypes.length > 1) {
          expect(getByText(pokemon.name)).toBeInTheDocument();
          fireEvent.click(nextPokemonBtn);
        }
      });
    });
  });
});

it('The button text must be the type name, p. ex. "Psychic"', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  pokemons.forEach(({ type }) => {
    fireEvent.click(getByTestId(type));
    expect(getByTestId(type).innerHTML).toMatch(type);
  });
});

describe('5 - The Pokédex must contain a button to reset the filter', () => {
  it('The button text must be All', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const allPokemons = getByText(/All/);
    const nextPokemonBtn = getByText(/Próximo pokémon/);

    expect(nextPokemonBtn).toBeInTheDocument();
    expect(allPokemons.tagName).toBe('BUTTON');
    expect(allPokemons.innerHTML).toMatch('All');
  });

  it('After clicking it, the Pokédex must circulate all pokémons again', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const allPokemonsBtn = getByText(/All/);
    const nextPokemonBtn = getByText(/Próximo pokémon/);
    fireEvent.click(allPokemonsBtn);
    pokemons.forEach(({ name }) => {
      expect(getByText(name)).toBeInTheDocument();
      fireEvent.click(nextPokemonBtn);
    });
  });

  it('When the page loads, the selected filter must be All', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    const nextPokemonButton = getByText('Próximo pokémon');
    pokemons.forEach(({ name }) => {
      expect(getByText(name)).toBeInTheDocument();
      fireEvent.click(nextPokemonButton);
    });
  });
});

describe('6 - The Pokédex should dynamically generate a filter button for each type of Pokémon', () => {
  it('Pokedex create one filter for type of pokemon', () => {
    const { getAllByTestId, getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const pokemonTypes = [...new Set(pokemons.map((pokemon) => pokemon.type))];

    expect(getByText('All')).toBeInTheDocument();
    expect(getByText('All').tagName).toBe('BUTTON');
    pokemonTypes.forEach((type) => {
      expect(getAllByTestId(type).length).toEqual(1);
    });
  });
});

describe('7 - If the filtered list of Pokémon has only one Pokémon, the Next Pokémon button should be disabled', () => {
  it('7', () => {
    const { getAllByText, getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonBtn = getByText(/Próximo pokémon/i);
    const allButton = getByText(/All/i);
    const bugButton = getAllByText('Bug')[1] || getByText('Bug');

    expect(bugButton.tagName).toBe('BUTTON');
    fireEvent.click(bugButton);
    expect(nextPokemonBtn.disabled).toBeTruthy();
    expect(allButton.tagName).toBe('BUTTON');
    fireEvent.click(allButton);
    expect(nextPokemonBtn.disabled).toBeFalsy();
  });
});

describe('8 - Pokedéx must display the name, type, average weight and image of the Pokémon displayed', () => {
  it('8', () => {
    const {
      getByText,
      queryAllByText,
      queryByText,
      getByAltText,
    } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonBtn = getByText(/Próximo pokémon/i);

    pokemons.forEach((pokemon) => {
      const pokemonName = getByText(pokemon.name);
      const pokemonType = queryAllByText(pokemon.type)[0];
      const pokemonWeight = queryByText(`Average weight: ${pokemon.averageWeight.value} ${pokemon.averageWeight.measurementUnit}`);
      const pokemonImageAlt = getByAltText(`${pokemon.name} sprite`);

      expect(pokemonName).toBeInTheDocument();
      expect(pokemonType).toBeInTheDocument();
      expect(pokemonWeight).toBeInTheDocument();
      expect(pokemonImageAlt).toBeInTheDocument();
      expect(pokemonImageAlt.src === pokemon.image).toBeTruthy();
      fireEvent.click(nextPokemonBtn);
    });
  });
});

describe('9 - The pokémon displayed in Pokedéx must contain a navigation link with the URL /pokemons/ where the pokémon id is displayed to display details of this pokémon', () => {
  it('9', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonBtn = getByText(/Próximo pokémon/i);

    pokemons.forEach(({ id }) => {
      const details = getByText(/details/i).href;
      console.log(details);
      expect(details).toMatch(`/pokemons/${id}`);
      fireEvent.click(nextPokemonBtn);
    });
  });
});

describe('10 - When clicking on the pokemon navigation link, the application should be redirected to the pokemon details page', () => {
  it('The URL displayed in the browser should change to / pokemon /, where is the id of the pokemon whose details you want to see', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <MemoryRouter history={history}>
        <App />
      </MemoryRouter>,
    );
    const details = getByText(/details/i);
    expect(details.tagName).toEqual('A');
    expect(getByText(details.innerHTML)).toBeInTheDocument();
    let actual = history.location.pathname;
    const pokeId = pokemons[0].id;
    expect(actual).toMatch('/');

    fireEvent.click(details);
    actual = history.location.pathname;
    expect(actual).toMatch(`/pokemons/${pokeId}`);
  });
});
