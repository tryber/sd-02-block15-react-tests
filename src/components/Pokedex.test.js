import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';
import pokemons from '../data';

afterEach(cleanup);

describe('02 - testing Pokedex renderization', () => {
  it('test if pokedex shows one pokemon at a time', () => {
    const { queryAllByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(queryAllByText(/Average weight/).length).toBe(1);
  });
});

describe('03 - testing button "Próximo pokémon"', () => {
  it('button should contain the text "Próximo pokémon"', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText(/Próximo pokémon/);
    expect(nextPokemonButton).toBeInTheDocument();
    expect(nextPokemonButton.tagName).toBe('BUTTON');
  });

  it('pressing the button "Próximo pokémon" the next pokémon in the list should be displayed', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText(/Próximo pokémon/);
    // fireEvent.click(nextPokemonButton);
    // expect(getByText('Charmander')).toBeInTheDocument();

    // outra forma de resolver, mais completa
    // for (let i = 0; i < pokemons.length; i += 1) {
    //   expect(getByText(pokemons[i])).toBeInTheDocument();
    //   fireEvent.click(nextPokemonButton);
    // }

    // forma refatorada
    // pokemons
    //   .map((pokemon) => pokemon.name)
    //   .forEach((pokemonName) => {
    //     expect(getByText(pokemonName)).toBeInTheDocument();
    //     fireEvent.click(nextPokemonButton);
    //   });

    // mais resumida
    pokemons.forEach(({ name }) => {
      expect(getByText(name)).toBeInTheDocument();
      fireEvent.click(nextPokemonButton);
    });
  });

  it('when in the last pokemon, the button should render the first pokémon', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText(/Próximo pokémon/);
    pokemons.forEach(() => fireEvent.click(nextPokemonButton));
    expect(getByText(pokemons[0].name)).toBeInTheDocument();
  });
});

describe('04 - Pokedex must have filter buttons', () => {
  it('when type of pokemon is selected, pokedex must show only the respective pokemons', () => {
    const { getByTestId, getAllByText, getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText(/Próximo pokémon/);

    pokemons.forEach(({ type }) => {
      expect(getByTestId(type)).toBeInTheDocument();
      fireEvent.click(getByTestId(type));
      expect(getAllByText(type).length).toEqual(2);
      const pokemonsTypes = pokemons.filter((pokemon) => pokemon.type === type);
      pokemonsTypes.forEach((pokemon) => {
        expect(getByText(pokemon.name)).toBeInTheDocument();
        if (pokemonsTypes.length > 1) {
          expect(getByText(pokemon.name)).toBeInTheDocument();
          fireEvent.click(nextPokemonButton);
        }
      });
    });
  });

  it('text of button must have be the pokemon type name', () => {
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
});

describe('05 - Pokedex must have a button for reset filter', () => {
  it('the button text should be "All"', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const allPokemonsButton = getByText(/All/);
    expect(allPokemonsButton).toBeInTheDocument();
    expect(allPokemonsButton.tagName).toBe('BUTTON');
    expect(allPokemonsButton.innerHTML).toMatch('All');
  });

  it('when click it, pokedex must circulate through all pokemons', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const allPokemonsButton = getByText(/All/);
    const nextPokemonButton = getByText(/Próximo pokémon/);
    fireEvent.click(allPokemonsButton);
    pokemons.forEach(({ name }) => {
      expect(getByText(name)).toBeInTheDocument();
      fireEvent.click(nextPokemonButton);
    });
  });

  it('when loading the page, "all" should be selected', () => {
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

describe('06 - The Pokédex should dynamically generate a filter button for each type of Pokémon', () => {
  it('testing the Pokedex types buttons and the render of button "All"', () => {
    const { getAllByTestId, getByText, getByTestId } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const pokemonsTypes = [...new Set(pokemons.map((pokemon) => pokemon.type))];
    expect(getByText('All')).toBeInTheDocument();
    expect(getByText('All').tagName).toBe('BUTTON');
    pokemonsTypes.forEach((type) => {
      expect(getByTestId(type)).toBeInTheDocument();
      expect(getAllByTestId(type).length).toEqual(1);
    });
  });
});

describe('07 - testing if the "Próximo pokémon" button is disabled', () => {
  it('The "Próximo pokémon" button should be disabled if the filtered list of Pokémon has only one Pokémon', () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    pokemons.forEach(({ type }) => {
      const pokeTypes = pokemons.filter((pokemon) => pokemon.type === type);
      fireEvent.click(getByTestId(type));
      if (pokeTypes.length <= 1) expect(getByText(/Próximo pokémon/).disabled).toBe(true);
    });
  });
});

describe('08 - Pokedex must show the pokemons\' name, type, average weight and photo', () => {
  it('average weight must be shown in the format "Average weight: <value> <measurementUnit>"', () => {
    const {
      getByAltText, queryByText, getByText, getAllByText,
    } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    pokemons.forEach(({
      name, type, averageWeight,
    }) => {
      expect(getByText(name)).toBeInTheDocument();
      expect(getAllByText(type)[0]).toBeInTheDocument();
      expect(queryByText(`Average weight: ${averageWeight.value} ${averageWeight.measurementUnit}`)).toBeInTheDocument();
      expect(getByAltText(`${name} sprite`)).toBeInTheDocument();
      fireEvent.click(getByText(/Próximo pokémon/));
    });
  });

  it('image has to be the "src" attribute with URL and the "alt" attribute', () => {
    const { getByAltText, getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    pokemons.forEach(({ name, image }) => {
      expect(getByAltText(`${name} sprite`)).toBeInTheDocument();
      expect(getByAltText(`${name} sprite`).src).toEqual(image);
      fireEvent.click(getByText(/Próximo pokémon/));
    });
  });
});

describe('09 - pokemon card should have a navigation link to it details page', () => {
  it('link should have the URL "/pokemons/<id>" with the pokemon respective id', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    pokemons.forEach(({ id }) => {
      const moreDetails = getByText('More details');
      expect(moreDetails.tagName).toBe('A');
      expect(moreDetails.href).toMatch(`pokemons/${id}`);
      fireEvent.click(getByText(/Próximo pokémon/));
    });
  });
});

describe('10 - when click the button "More Details" the page should redirect to the pokemon details page', () => {
  it('the URL has to change to "/pokemon/<id>"', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    pokemons.forEach(({ id }, index) => {
      fireEvent.click(getByText(/More details/i));
      expect(history.location.pathname).toMatch(`/pokemons/${id}`);
      fireEvent.click(getByText(/Home/));
      for (let i = 0; i < index + 1; i += 1) {
        fireEvent.click(getByText(/Próximo pokémon/));
        // iteração necessária para ele clicar o número de vezes corresponte para ir para o pokemon
        // certo quando volta para a página Home
      }
    });
  });
});

describe.skip('11 - pokemon details page must show name, type, average weight and image of the pokemon', () => {
  it('average weight must be shown in the format "Average weight: <value> <measurementUnit>"', () => {
    const history = createMemoryHistory();
    const { getByText, queryByText, getByAltText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );

    pokemons.forEach(({
      name, type, averageWeight, image,
    }) => {
      fireEvent.click(getByText(/More details/i));
      expect(getByText(name)).toBeInTheDocument();
      expect(getByText(type)).toBeInTheDocument();
      expect(queryByText(`Average weight: ${averageWeight.value} ${averageWeight.measurementUnit}`)).toBeInTheDocument();
      expect(getByAltText(`${name} sprite`).src).toEqual(image);
      expect(getByAltText(`${name} sprite`)).toBeInTheDocument();
      fireEvent.click(getByText(/Home/));
      fireEvent.click(getByText(/Próximo pokémon/));
    });
  });
});

describe.skip('12 - pokemons details page shouldn\'t have a link "More details', () => {
  it('testing if there is not a "More details" link', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    pokemons.forEach(() => {
      fireEvent.click(getByText(/More details/i));
      expect(getByText(/More details/i)).not.toBeInTheDocument();
      fireEvent.click(getByText(/Home/));
      fireEvent.click(getByText(/Próximo pokémon/));
    });
  });
});
