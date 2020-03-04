import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import App from './App';
import {
  Pokedex, PokemonDetails, About, FavoritePokemons, NotFound,
} from './components';

const pokemonsList = [
  {
    id: 1,
    name: 'Rapidash',
    type: 'Fire',
    averageWeight: {
      value: '95.0',
      measurementUnit: 'kg',
    },
    image: 'https://cdn.bulbagarden.net/upload/5/58/Spr_5b_078.png',
    moreInfo: 'https://bulbapedia.bulbagarden.net/wiki/Rapidash_(Pok%C3%A9mon)',
    foundAt: [
      {
        location: 'Kanto Route 28',
        map: 'https://cdn.bulbagarden.net/upload/5/5b/Kanto_Route_28_Map.png',
      },
      {
        location: 'Johto Mount Silver',
        map: 'https://cdn.bulbagarden.net/upload/9/95/Johto_Mt_Silver_Map.png',
      },
    ],
    summary: 'At full gallop, its four hooves barely touch the ground because it moves so incredibly fast.',
  },
  {
    id: 2,
    name: 'Charmander',
    type: 'Fire',
    averageWeight: {
      value: '8.5',
      measurementUnit: 'kg',
    },
    image: 'https://cdn.bulbagarden.net/upload/0/0a/Spr_5b_004.png',
    moreInfo: 'https://bulbapedia.bulbagarden.net/wiki/Charmander_(Pok%C3%A9mon)',
    foundAt: [
      {
        location: 'Alola Route 3',
        map: 'https://cdn.bulbagarden.net/upload/9/93/Alola_Route_3_Map.png',
      },
      {
        location: 'Kanto Route 3',
        map: 'https://cdn.bulbagarden.net/upload/4/4a/Kanto_Route_3_Map.png',
      },
      {
        location: 'Kanto Route 4',
        map: 'https://cdn.bulbagarden.net/upload/2/24/Kanto_Route_4_Map.png',
      },
      {
        location: 'Kanto Rock Tunnel',
        map: 'https://cdn.bulbagarden.net/upload/6/6f/Kanto_Rock_Tunnel_Map.png',
      },
    ],
    summary: 'The flame on its tail shows the strength of its life force. If it is weak, the flame also burns weakly.',
  },
  {
    id: 3,
    name: 'Caterpie',
    type: 'Bug',
    averageWeight: {
      value: '2.9',
      measurementUnit: 'kg',
    },
    image: 'https://cdn.bulbagarden.net/upload/8/83/Spr_5b_010.png',
    moreInfo: 'https://bulbapedia.bulbagarden.net/wiki/Caterpie_(Pok%C3%A9mon)',
    foundAt: [
      {
        location: 'Johto Route 30',
        map: 'https://cdn.bulbagarden.net/upload/7/76/Johto_Route_30_Map.png',
      },
      {
        location: 'Johto Route 31',
        map: 'https://cdn.bulbagarden.net/upload/2/2b/Johto_Route_31_Map.png',
      },
      {
        location: 'Ilex Forest',
        map: 'https://cdn.bulbagarden.net/upload/a/ae/Johto_Ilex_Forest_Map.png',
      },
      {
        location: 'Johto National Park',
        map: 'https://cdn.bulbagarden.net/upload/4/4e/Johto_National_Park_Map.png',
      },
    ],
    summary: 'For protection, it releases a horrible stench from the antennae on its head to drive away enemies.',
  },
  {
    id: 4,
    name: 'Ekans',
    type: 'Poison',
    averageWeight: {
      value: '6.9',
      measurementUnit: 'kg',
    },
    image: 'https://cdn.bulbagarden.net/upload/1/18/Spr_5b_023.png',
    moreInfo: 'https://bulbapedia.bulbagarden.net/wiki/Ekans_(Pok%C3%A9mon)',
    foundAt: [
      {
        location: 'Goldenrod Game Corner',
        map: 'https://cdn.bulbagarden.net/upload/e/ec/Johto_Goldenrod_City_Map.png',
      },
    ],
    summary: 'It can freely detach its jaw to swallow large prey whole. It can become too heavy to move, however.',
  },
];

const sameTypePokemonList = [
  {
    id: 1,
    name: 'Pikachu',
    type: 'Electric',
    averageWeight: {
      value: '6.0',
      measurementUnit: 'kg',
    },
    image: 'https://cdn.bulbagarden.net/upload/b/b2/Spr_5b_025_m.png',
    moreInfo: 'https://bulbapedia.bulbagarden.net/wiki/Pikachu_(Pok%C3%A9mon)',
    foundAt: [
      {
        location: 'Kanto Viridian Forest',
        map: 'https://cdn.bulbagarden.net/upload/0/08/Kanto_Route_2_Map.png',
      },
      {
        location: 'Kanto Power Plant',
        map: 'https://cdn.bulbagarden.net/upload/b/bd/Kanto_Celadon_City_Map.png',
      },
    ],
    summary: 'This intelligent Pokémon roasts hard berries with electricity to make them tender enough to eat.',
  },
  {
    id: 2,
    name: 'Charmander',
    type: 'Electric',
    averageWeight: {
      value: '8.5',
      measurementUnit: 'kg',
    },
    image: 'https://cdn.bulbagarden.net/upload/0/0a/Spr_5b_004.png',
    moreInfo: 'https://bulbapedia.bulbagarden.net/wiki/Charmander_(Pok%C3%A9mon)',
    foundAt: [
      {
        location: 'Alola Route 3',
        map: 'https://cdn.bulbagarden.net/upload/9/93/Alola_Route_3_Map.png',
      },
      {
        location: 'Kanto Route 3',
        map: 'https://cdn.bulbagarden.net/upload/4/4a/Kanto_Route_3_Map.png',
      },
      {
        location: 'Kanto Route 4',
        map: 'https://cdn.bulbagarden.net/upload/2/24/Kanto_Route_4_Map.png',
      },
      {
        location: 'Kanto Rock Tunnel',
        map: 'https://cdn.bulbagarden.net/upload/6/6f/Kanto_Rock_Tunnel_Map.png',
      },
    ],
    summary: 'The flame on its tail shows the strength of its life force. If it is weak, the flame also burns weakly.',
  },
  {
    id: 3,
    name: 'Caterpie',
    type: 'Electric',
    averageWeight: {
      value: '2.9',
      measurementUnit: 'kg',
    },
    image: 'https://cdn.bulbagarden.net/upload/8/83/Spr_5b_010.png',
    moreInfo: 'https://bulbapedia.bulbagarden.net/wiki/Caterpie_(Pok%C3%A9mon)',
    foundAt: [
      {
        location: 'Johto Route 30',
        map: 'https://cdn.bulbagarden.net/upload/7/76/Johto_Route_30_Map.png',
      },
      {
        location: 'Johto Route 31',
        map: 'https://cdn.bulbagarden.net/upload/2/2b/Johto_Route_31_Map.png',
      },
      {
        location: 'Ilex Forest',
        map: 'https://cdn.bulbagarden.net/upload/a/ae/Johto_Ilex_Forest_Map.png',
      },
      {
        location: 'Johto National Park',
        map: 'https://cdn.bulbagarden.net/upload/4/4e/Johto_National_Park_Map.png',
      },
    ],
    summary: 'For protection, it releases a horrible stench from the antennae on its head to drive away enemies.',
  },
  {
    id: 4,
    name: 'Ekans',
    type: 'Electric',
    averageWeight: {
      value: '6.9',
      measurementUnit: 'kg',
    },
    image: 'https://cdn.bulbagarden.net/upload/1/18/Spr_5b_023.png',
    moreInfo: 'https://bulbapedia.bulbagarden.net/wiki/Ekans_(Pok%C3%A9mon)',
    foundAt: [
      {
        location: 'Goldenrod Game Corner',
        map: 'https://cdn.bulbagarden.net/upload/e/ec/Johto_Goldenrod_City_Map.png',
      },
    ],
    summary: 'It can freely detach its jaw to swallow large prey whole. It can become too heavy to move, however.',
  },
];

const uniquePokemonList = [
  {
    id: 1,
    name: 'Voador',
    type: 'Dragon',
    averageWeight: {
      value: '6.0',
      measurementUnit: 'kg',
    },
    image: 'https://cdn.bulbagarden.net/upload/b/b2/Spr_5b_025_m.png',
    moreInfo: 'https://bulbapedia.bulbagarden.net/wiki/Pikachu_(Pok%C3%A9mon)',
    foundAt: [
      {
        location: 'Kanto Viridian Forest',
        map: 'https://cdn.bulbagarden.net/upload/0/08/Kanto_Route_2_Map.png',
      },
      {
        location: 'Kanto Power Plant',
        map: 'https://cdn.bulbagarden.net/upload/b/bd/Kanto_Celadon_City_Map.png',
      },
    ],
    summary: 'This intelligent Pokémon roasts hard berries with electricity to make them tender enough to eat.',
  },
];

const allFavoritePokemons = {
  1: true,
  2: true,
  3: true,
  4: true,
};

const notFavoritePokemons = {
  1: false,
  2: false,
  3: false,
  4: false,
};

const uniqueFavoritePokemons = {
  1: true,
};

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    BrowserRouter: ({ children }) => (
      <div>
        {' '}
        {children}
        {' '}
      </div>
    ),
  };
});
function renderWithRouter(
  ui,
  { route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {},
) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    history,
  };
}

test('renders a reading with the text `Pokédex`', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const heading = getByText(/Pokédex/i);
  expect(heading).toBeInTheDocument();
});

test('shows the Pokedéx when the route is `/`', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );

  expect(getByText('Encountered pokémons')).toBeInTheDocument();
});

describe('Pokedéx should display only 1 pokémon', () => {
  function ex2(pokemons, isPokemonFavoriteById) {
    const { queryAllByText, getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
      </MemoryRouter>,
    );
    const nextButton = getByText(/Próximo pokémon/i);
    pokemons.forEach((pokemon) => {
      const allPokemon = queryAllByText(pokemon.name);
      expect(allPokemon.length).toBe(1);
      fireEvent.click(nextButton);
    });
  }

  test('case 1', () => {
    ex2(pokemonsList, allFavoritePokemons);
  });
  test('case 2', () => {
    ex2(uniquePokemonList, uniqueFavoritePokemons);
  });
  test('case 3', () => {
    ex2(sameTypePokemonList, notFavoritePokemons);
  });
});

describe('shows the next pókemon when press the button', () => {
  function ex3(pokemons, isPokemonFavoriteById) {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
      </MemoryRouter>,
    );
    const nextButton = getByText(/Próximo pokémon/i);
    expect(nextButton).toBeInTheDocument();

    for (let i = 0; i < pokemons.length; i += 1) {
      expect(getByText(pokemons[i].name)).toBeInTheDocument();
      fireEvent.click(nextButton);
    }
    expect(getByText(pokemons[0].name)).toBeInTheDocument();
  }
  test('case 1', () => {
    ex3(pokemonsList, allFavoritePokemons);
  });
  test('case 2', () => {
    ex3(uniquePokemonList, uniqueFavoritePokemons);
  });
  test('case 3', () => {
    ex3(sameTypePokemonList, notFavoritePokemons);
  });
});

describe('filter the pokedéx by the type of pokemon', () => {
  function ex4(pokemons, isPokemonFavoriteById) {
    const { queryAllByText, getByText, getAllByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
      </MemoryRouter>,
    );

    const pokemonTypes = [...new Set(pokemons.map((pokemon) => pokemon.type))];
    const buttonAll = getByText(/All/i);
    let aux = buttonAll;
    for (let i = 0; i < pokemonTypes.length; i += 1) {
      expect(aux.nextSibling.textContent).toBe(pokemonTypes[i]);
      aux = aux.nextSibling;

      const buttonType = getAllByText(pokemonTypes[i])[1] || getByText(pokemonTypes[i]);
      fireEvent.click(buttonType);
      expect(queryAllByText(pokemonTypes[i]).length).toBe(2);
      fireEvent.click(getByText(/Próximo pokémon/i));
      expect(getByText(/Average weight:/i).previousSibling.textContent).toBe(pokemonTypes[i]);
    }
  }

  test('case 1', () => {
    ex4(pokemonsList, allFavoritePokemons);
  });
  test('case 2', () => {
    ex4(uniquePokemonList, uniqueFavoritePokemons);
  });
  test('case 3', () => {
    ex4(sameTypePokemonList, notFavoritePokemons);
  });
});

describe('Pokedéx must contain a reset button', () => {
  function ex5(pokemons, isPokemonFavoriteById) {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
      </MemoryRouter>,
    );
    const resetButton = getByText(/All/i);
    expect(resetButton).toBeInTheDocument();

    const nextButton = getByText(/Próximo pokémon/i);
    const allPokemons = pokemons.map((pokemon) => pokemon.name);

    const containedPokemons = () => allPokemons.map(() => {
      const pokemonName = getByText(/Average weight:/i).previousSibling.previousSibling.textContent;
      fireEvent.click(nextButton);
      return pokemonName;
    });

    expect(containedPokemons()).toStrictEqual(allPokemons);
    fireEvent.click(resetButton.nextSibling);
    fireEvent.click(resetButton);
    expect(containedPokemons()).toStrictEqual(allPokemons);
  }

  test('case 1', () => {
    ex5(pokemonsList, allFavoritePokemons);
  });
  test('case 2', () => {
    ex5(uniquePokemonList, uniqueFavoritePokemons);
  });
  test('case 3', () => {
    ex5(sameTypePokemonList, notFavoritePokemons);
  });
});

describe('Pokedéx should render a filter button to each type of pokemóns', () => {
  function ex6(pokemons, isPokemonFavoriteById) {
    const { getByText, getAllByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
      </MemoryRouter>,
    );

    const pokemonTypes = [...new Set(pokemons.map((pokemon) => pokemon.type))];
    pokemonTypes.forEach((type) => {
      const buttonType = getAllByText(type)[1] || getByText(type);
      expect(buttonType).toBeInTheDocument();
      expect(getByText(/All/i)).toBeInTheDocument();
    });
  }

  test('case 1', () => {
    ex6(pokemonsList, allFavoritePokemons);
  });
  test('case 2', () => {
    ex6(uniquePokemonList, uniqueFavoritePokemons);
  });
  test('case 3', () => {
    ex6(sameTypePokemonList, notFavoritePokemons);
  });
});

describe('the button `Próximo pokémon` should be disabled if the list has only 1 pokémon', () => {
  function ex7(pokemons, isPokemonFavoriteById) {
    const { getByText, getAllByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
      </MemoryRouter>,
    );
    const nextButton = getByText(/Próximo pokémon/i);
    const pokemonTypes = [...new Set(pokemons.map((pokemon) => pokemon.type))];

    pokemonTypes.forEach((type) => {
      const buttonType = getAllByText(type)[1] || getByText(type);
      fireEvent.click(buttonType);
      const pokemonName = getByText(/Average weight:/i).previousSibling.previousSibling.textContent;
      fireEvent.click(nextButton);
      const nextPokemon = getByText(/Average weight:/i).previousSibling.previousSibling.textContent;
      if (pokemonName === nextPokemon) expect(nextButton.disabled).toBe(true);
      else expect(nextButton.disabled).toBe(false);
    });
  }

  test('case 1', () => {
    ex7(pokemonsList, allFavoritePokemons);
  });
  test('case 2', () => {
    ex7(uniquePokemonList, uniqueFavoritePokemons);
  });
  test('case 3', () => {
    ex7(sameTypePokemonList, notFavoritePokemons);
  });
});

describe('Pokedéx should display the name, type, average weight and image of the displayed pokemon', () => {
  function ex8(pokemons, isPokemonFavoriteById) {
    const { getByText, getByAltText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
      </MemoryRouter>,
    );
    const nextPokemon = getByText(/Próximo pokémon/i);
    pokemons.forEach((pokemon) => {
      const averageWeight = getByText(/Average weight:/i).textContent;
      const pokemonWeight = `Average weight: ${pokemon.averageWeight.value} ${pokemon.averageWeight.measurementUnit}`;
      const pokemonImage = getByAltText(`${pokemon.name} sprite`);
      expect(averageWeight).toBe(pokemonWeight);
      expect(pokemonImage.src).toBe(pokemon.image);
      expect(pokemonImage.alt).toBe(`${pokemon.name} sprite`);
      fireEvent.click(nextPokemon);
    });
  }

  test('case 1', () => {
    ex8(pokemonsList, allFavoritePokemons);
  });
  test('case 2', () => {
    ex8(uniquePokemonList, uniqueFavoritePokemons);
  });
  test('case 3', () => {
    ex8(sameTypePokemonList, notFavoritePokemons);
  });
});

describe('the pokemon must contain a navigation link to view details', () => {
  function ex9(pokemons, isPokemonFavoriteById) {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />
      </MemoryRouter>,
    );
    const nextPokemon = getByText(/Próximo pokémon/i);
    pokemons.forEach((pokemon) => {
      const navLink = getByText(/More details/i).href;
      expect(navLink).toBe(`http://localhost/pokemons/${pokemon.id}`);
      fireEvent.click(nextPokemon);
    });
  }

  test('case 1', () => {
    ex9(pokemonsList, allFavoritePokemons);
  });
  test('case 2', () => {
    ex9(uniquePokemonList, uniqueFavoritePokemons);
  });
  test('case 3', () => {
    ex9(sameTypePokemonList, notFavoritePokemons);
  });
});

describe('app should be redirected to pokémon details page when clicks the link', () => {
  function ex10(pokemons, isPokemonFavoriteById) {
    const { getByText, queryByText, history } = renderWithRouter(
      <Pokedex pokemons={pokemons} isPokemonFavoriteById={isPokemonFavoriteById} />,
    );
    expect(history.location.pathname).toBe('/');
    const detailsButton = getByText(/More details/i);
    expect(detailsButton).toBeInTheDocument();
    const detailsLink = detailsButton.href;
    fireEvent.click(detailsButton);
    expect(`http://localhost${history.location.pathname}`).toBe(detailsLink);
  }

  test('case 1', () => {
    ex10(pokemonsList, allFavoritePokemons);
  });
  test('case 2', () => {
    ex10(uniquePokemonList, uniqueFavoritePokemons);
  });
  test('case 3', () => {
    ex10(sameTypePokemonList, notFavoritePokemons);
  });
});

const func = jest.fn();
describe('pokémon details page should display the name, type, average weight and image of the displayed pokemon', () => {
  function ex11(pokemons, isPokemonFavoriteById, pokemon) {
    const match = {
      params: {
        id: `${pokemon.id}`,
      },
    };
    const { getByText, getByAltText } = render(
      <MemoryRouter initialEntries={['/']}>
        <PokemonDetails
          pokemons={pokemons}
          onUpdateFavoritePokemons={func}
          isPokemonFavoriteById={isPokemonFavoriteById}
          match={match}
        />
      </MemoryRouter>,
    );
    const pokemonWeight = getByText(`Average weight: ${pokemon.averageWeight.value} ${pokemon.averageWeight.measurementUnit}`);
    const pokemonImage = getByAltText(`${pokemon.name} sprite`);
    expect(pokemonWeight).toBeInTheDocument();
    expect(pokemonImage.src).toBe(pokemon.image);
    expect(pokemonImage.alt).toBe(`${pokemon.name} sprite`);
  }

  test('case 1', () => {
    pokemonsList.forEach((pokemon) => (
      ex11(pokemonsList, allFavoritePokemons, pokemon)
    ));
  });
  test('case 2', () => {
    uniquePokemonList.forEach((pokemon) => (
      ex11(uniquePokemonList, uniqueFavoritePokemons, pokemon)
    ));
  });
  test('case 3', () => {
    sameTypePokemonList.forEach((pokemon) => (
      ex11(sameTypePokemonList, notFavoritePokemons, pokemon)
    ));
  });
});

describe('pokemon details page must not contain a navigation link to view details', () => {
  function ex12(pokemons, isPokemonFavoriteById, pokemon) {
    const match = {
      params: {
        id: `${pokemon.id}`,
      },
    };
    const { queryByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <PokemonDetails
          pokemons={pokemons}
          onUpdateFavoritePokemons={func}
          isPokemonFavoriteById={isPokemonFavoriteById}
          match={match}
        />
      </MemoryRouter>,
    );
    expect(queryByText(/More details/i)).toBeNull();
  }

  test('case 1', () => {
    pokemonsList.forEach((pokemon) => (
      ex12(pokemonsList, allFavoritePokemons, pokemon)
    ));
  });
  test('case 2', () => {
    uniquePokemonList.forEach((pokemon) => (
      ex12(uniquePokemonList, uniqueFavoritePokemons, pokemon)
    ));
  });
  test('case 3', () => {
    sameTypePokemonList.forEach((pokemon) => (
      ex12(sameTypePokemonList, notFavoritePokemons, pokemon)
    ));
  });
});

describe('pokemon details page must display a summary section', () => {
  function ex13(pokemons, isPokemonFavoriteById, pokemon) {
    const match = {
      params: {
        id: `${pokemon.id}`,
      },
    };
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <PokemonDetails
          pokemons={pokemons}
          onUpdateFavoritePokemons={func}
          isPokemonFavoriteById={isPokemonFavoriteById}
          match={match}
        />
      </MemoryRouter>,
    );
    const pokemonSummary = getByText(/Summary/i);
    expect(pokemonSummary).toBeInTheDocument();
    expect((pokemonSummary).tagName).toBe('H2');
    expect(pokemonSummary.nextSibling.tagName).toBe('P');
    expect(pokemonSummary.nextSibling.textContent).toBe(pokemon.summary);
  }

  pokemonsList.forEach((pokemon) => (
    test(`case ${pokemon.name}`, () => {
      ex13(pokemonsList, allFavoritePokemons, pokemon);
    })
  ));
  uniquePokemonList.forEach((pokemon) => (
    test(`case ${pokemon.name}`, () => {
      ex13(uniquePokemonList, uniqueFavoritePokemons, pokemon);
    })
  ));
  sameTypePokemonList.forEach((pokemon) => (
    test(`case ${pokemon.name}`, () => {
      ex13(sameTypePokemonList, notFavoritePokemons, pokemon);
    })
  ));
});

describe('the details page should display a section with the maps of the pokémons locations', () => {
  function ex14(pokemons, isPokemonFavoriteById, pokemon) {
    const match = {
      params: {
        id: `${pokemon.id}`,
      },
    };
    const { getByText, queryAllByAltText } = render(
      <MemoryRouter initialEntries={['/']}>
        <PokemonDetails
          pokemons={pokemons}
          onUpdateFavoritePokemons={func}
          isPokemonFavoriteById={isPokemonFavoriteById}
          match={match}
        />
      </MemoryRouter>,
    );
    const pokemonLocation = getByText(/Game Locations/i);
    expect(pokemonLocation.textContent).toStrictEqual(`Game Locations of ${pokemon.name}`);
    expect((pokemonLocation).tagName).toBe('H2');
    expect(pokemonLocation.nextSibling.childNodes.length).toBe(pokemon.foundAt.length);
    pokemon.foundAt.forEach((location, index) => {
      expect(getByText(location.location)).toBeInTheDocument();
      const locationAlt = `${pokemon.name} location`;
      const locationImages = queryAllByAltText(locationAlt);
      expect(locationImages[index].src).toBe(location.map);
      expect(locationImages[index].alt).toBe(locationAlt);
    });
  }

  pokemonsList.forEach((pokemon) => (
    test(`case ${pokemon.name}`, () => {
      ex14(pokemonsList, allFavoritePokemons, pokemon);
    })
  ));
  uniquePokemonList.forEach((pokemon) => (
    test(`case ${pokemon.name}`, () => {
      ex14(uniquePokemonList, uniqueFavoritePokemons, pokemon);
    })
  ));
  sameTypePokemonList.forEach((pokemon) => (
    test(`case ${pokemon.name}`, () => {
      ex14(sameTypePokemonList, notFavoritePokemons, pokemon);
    })
  ));
});

describe('the details page should allow you to favor an pokemon', () => {
  function ex15(pokemons, isPokemonFavoriteById, pokemon) {
    const match = {
      params: {
        id: `${pokemon.id}`,
      },
    };

    const updateFavoritePokemons = jest.fn((array, id) => {
      array[id] = !array[id];
    });

    const { getByLabelText } = render(
      <MemoryRouter initialEntries={['/']}>
        <PokemonDetails
          pokemons={pokemons}
          onUpdateFavoritePokemons={() => updateFavoritePokemons(isPokemonFavoriteById, pokemon.id)}
          isPokemonFavoriteById={isPokemonFavoriteById}
          match={match}
        />
      </MemoryRouter>,
    );
    const checkbox = getByLabelText(/Pokémon favoritado?/i);
    expect(getByLabelText(/Pokémon favoritado?/i)).toBeInTheDocument();
    const isChecked = isPokemonFavoriteById[pokemon.id];
    fireEvent.click(checkbox);
    expect(isPokemonFavoriteById[pokemon.id]).not.toBe(isChecked);
    fireEvent.click(checkbox);
    expect(isPokemonFavoriteById[pokemon.id]).toBe(isChecked);
  }

  pokemonsList.forEach((pokemon) => (
    test(`case ${pokemon.name}`, () => {
      ex15(pokemonsList, allFavoritePokemons, pokemon);
    })
  ));
  uniquePokemonList.forEach((pokemon) => (
    test(`case ${pokemon.name}`, () => {
      ex15(uniquePokemonList, uniqueFavoritePokemons, pokemon);
    })
  ));
  sameTypePokemonList.forEach((pokemon) => (
    test(`case ${pokemon.name}`, () => {
      ex15(sameTypePokemonList, notFavoritePokemons, pokemon);
    })
  ));
});

describe('favorite pokemons should display a star icon', () => {
  function ex16(pokemons, isPokemonFavoriteById, pokemon) {
    const match = {
      params: {
        id: `${pokemon.id}`,
      },
    };
    const { getByAltText } = render(
      <MemoryRouter initialEntries={['/']}>
        <PokemonDetails
          pokemons={pokemons}
          onUpdateFavoritePokemons={func}
          isPokemonFavoriteById={isPokemonFavoriteById}
          match={match}
        />
      </MemoryRouter>,
    );
    if (isPokemonFavoriteById[pokemon.id]) {
      const starIcon = getByAltText(`${pokemon.name} is marked as favorite`);
      expect(starIcon).toBeInTheDocument();
      expect(starIcon.alt).toBe(`${pokemon.name} is marked as favorite`);
      expect(starIcon.src).toBe('http://localhost/star-icon.svg');
    }
  }

  pokemonsList.forEach((pokemon) => (
    test(`case ${pokemon.name}`, () => {
      ex16(pokemonsList, allFavoritePokemons, pokemon);
    })
  ));
  uniquePokemonList.forEach((pokemon) => (
    test(`case ${pokemon.name}`, () => {
      ex16(uniquePokemonList, uniqueFavoritePokemons, pokemon);
    })
  ));
  sameTypePokemonList.forEach((pokemon) => (
    test(`case ${pokemon.name}`, () => {
      ex16(sameTypePokemonList, notFavoritePokemons, pokemon);
    })
  ));
});

test('at the top of the application should be a fixed set of navigation links', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );
  const linkHome = getByText('Home');
  const linkAbout = getByText('About');
  const linkFavorite = getByText('Favorite Pokémons');
  expect(linkHome && linkAbout && linkFavorite).toBeInTheDocument();
  expect(linkHome.href).toBe('http://localhost/');
  expect(linkAbout.href).toBe('http://localhost/about');
  expect(linkFavorite.href).toBe('http://localhost/favorites');
});

test('by clicking on the `Home` link, the app should be redirected to the URL `/`', () => {
  const { getByText, history } = renderWithRouter(
    <App />,
  );
  expect(history.location.pathname).toBe('/');
  const homeButton = getByText(/Home/i);
  const homeLink = homeButton.href;
  fireEvent.click(homeButton);
  expect(`http://localhost${history.location.pathname}`).toBe(homeLink);
});

test('by clicking on the `About` link, the app should be redirected to the URL `/about`', () => {
  const { getByText, history } = renderWithRouter(
    <App />,
  );
  expect(history.location.pathname).toBe('/');
  const aboutButton = getByText(/About/i);
  const aboutLink = aboutButton.href;
  fireEvent.click(aboutButton);
  expect(`http://localhost${history.location.pathname}`).toBe(aboutLink);
});

test('by clicking on the `Favorite Pokémons` link, the app should be redirected to the URL `/favorites`', () => {
  const { getByText, history } = renderWithRouter(
    <App />,
  );
  expect(history.location.pathname).toBe('/');
  const favoriteButton = getByText(/Favorite Pokémons/i);
  const favoriteLink = favoriteButton.href;
  fireEvent.click(favoriteButton);
  expect(`http://localhost${history.location.pathname}`).toBe(favoriteLink);
});

test('`About` page should display pokédex info', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <About />
    </MemoryRouter>,
  );
  const aboutTitle = getByText(/About Pokédex/i);
  expect(aboutTitle).toBeInTheDocument();
  expect(aboutTitle.tagName).toBe('H2');
  const aboutSection = aboutTitle.nextSibling.childNodes;
  expect(aboutSection[0].tagName).toBe('P');
  expect(aboutSection[1].tagName).toBe('P');
  expect(aboutSection[2].src).toBe('https://cdn.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png');
});

describe('the favorite pokemon page should display your favorite pokemons', () => {
  function ex22(pokemons, isPokemonFavoriteById) {
    const favoritePokemons = pokemons.filter(({ id }) => isPokemonFavoriteById[id]);
    const { getByAltText, getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <FavoritePokemons pokemons={favoritePokemons} />
      </MemoryRouter>,
    );
    if (favoritePokemons.length === 0) expect(getByText(/No favorite pokemon found/i)).toBeInTheDocument();
    else {
      favoritePokemons.forEach((pokemon) => {
        expect(getByText(pokemon.name)).toBeInTheDocument();
        expect(getByText(`Average weight: ${pokemon.averageWeight.value} ${pokemon.averageWeight.measurementUnit}`)).toBeInTheDocument();
        expect(getByAltText(`${pokemon.name} sprite`).src).toBe(pokemon.image);
      });
    }
  }

  test('case 1', () => {
    ex22(pokemonsList, allFavoritePokemons);
  });
  test('case 2', () => {
    ex22(uniquePokemonList, uniqueFavoritePokemons);
  });
  test('case 3', () => {
    ex22(sameTypePokemonList, notFavoritePokemons);
  });
});

describe('entering an unknown URL displays `Not Found` page', () => {
  function ex23(route) {
    const { getByText, getByAltText } = renderWithRouter(
      <NotFound />, { route: `/${route}` },
    );
    const notFound = getByText(/Page requested not found/i);
    expect(notFound).toBeInTheDocument();
    expect(notFound.tagName).toBe('H2');
    const imgError = getByAltText(/Pikachu crying because the page requested was not found/i);
    expect(imgError).toBeInTheDocument();
    expect(imgError.src).toBe('https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif');
  }

  test('case 1', () => {
    ex23('aleatorio');
  });
  test('case 2', () => {
    ex23('xablau');
  });
  test('case 3', () => {
    ex23('ololo');
  });
});
