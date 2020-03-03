import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import App from './App';
import Pokedex from './components/Pokedex';
import FavoritePokemons from './components/FavoritePokemons';
import fakePokemons from './fakeData';

afterEach(cleanup);

const arrayOfPokemonsName = fakePokemons.map(({ name }) => name);
const arrayOfPokemonsTypes = fakePokemons.map(({ type }) => type);

const booleanFavoritedPokemons = {
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

const arrayFavoritedpokemons = fakePokemons.filter(({ id }) => booleanFavoritedPokemons[id]);
const arrayNotFavoritedpokemons = fakePokemons.filter(({ id }) => !booleanFavoritedPokemons[id]);

test('Renders a reading with the text `Pokédex`', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const heading = getByText(/Pokédex/i);
  expect(heading).toBeInTheDocument();
});

describe('Teste 1', () => {
  test('1.1 - shows the Pokedéx when the route is `/`', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(getByText('Encountered pokémons')).toBeInTheDocument();
  });
});

describe('Teste 2', () => {
  test('2.1 - Pokedex shows only one pokemon each time', () => {
    const { getAllByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(getAllByText('More details').length).toBe(1);
  });
});

describe('Teste 3 - onClick shows the next Pokemon', () => {
  test('3.1 - The button must contain "Proximo Pokémon"', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(getByText('Próximo pokémon')).toBeInTheDocument();
    expect(getByText('Próximo pokémon').tagName).toBe('BUTTON');
  });
  test('3.2 - Sequential clicks should change for the next Pokemon', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex
          pokemons={fakePokemons}
          isPokemonFavoriteById={booleanFavoritedPokemons}
        />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    arrayOfPokemonsName.forEach((pokemonName) => {
      expect(getByText(pokemonName)).toBeInTheDocument();
      fireEvent.click(nextPokemonButton);
    });
  });
  test('3.3 - After the last pokemon, it should go back to the first one', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex
          pokemons={fakePokemons}
          isPokemonFavoriteById={booleanFavoritedPokemons}
        />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    arrayOfPokemonsName.forEach(() => fireEvent.click(nextPokemonButton));
    expect(getByText(arrayOfPokemonsName[0])).toBeInTheDocument();
  });
});

describe('Teste 4 - Pokedex should contain filter buttons', () => {
  test('4.1 - Type filter should select only the pokemons with respective type', () => {
    const { getByText, getAllByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex
          pokemons={fakePokemons}
          isPokemonFavoriteById={booleanFavoritedPokemons}
        />
      </MemoryRouter>,
    );
    const allPokemonTypes = [...new Set(arrayOfPokemonsTypes)];
    const nextPokemonButton = getByText('Próximo pokémon');
    allPokemonTypes.forEach((tipo) => {
      const typeButton = getAllByText(tipo)[1] || getByText(tipo);
      fireEvent.click(typeButton);
      const nomesPokemonsTipos = fakePokemons.filter((e) => e.type === tipo);
      nomesPokemonsTipos.forEach((pokemonType, index) => {
        expect(getByText(nomesPokemonsTipos[index].name)).toBeInTheDocument();
        if (nomesPokemonsTipos.length > 1) fireEvent.click(nextPokemonButton);
      });
    });
  });
  test('4.2 - The button text should be the name of the type', () => {
    const { getByText, getAllByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex
          pokemons={fakePokemons}
          isPokemonFavoriteById={booleanFavoritedPokemons}
        />
      </MemoryRouter>,
    );
    arrayOfPokemonsTypes.forEach((tipo) => {
      const btnNameType = getAllByText(tipo)[1] || getByText(tipo);
      expect(btnNameType).toBeInTheDocument();
      expect(btnNameType.tagName).toBe('BUTTON');
    });
  });
});

describe('Teste 5 - Pokedex should contain reset button filter', () => {
  test('5.1 - The text should be "All"', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(getByText('All')).toBeInTheDocument();
    expect(getByText('All').tagName).toBe('BUTTON');
  });
  const func5 = (estadoinicial) => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex
          pokemons={fakePokemons}
          isPokemonFavoriteById={booleanFavoritedPokemons}
        />
      </MemoryRouter>,
    );
    const btnAllClick = getByText('All');
    const nextPokemonButton = getByText('Próximo pokémon');
    if (!estadoinicial) {
      fireEvent.click(btnAllClick);
    }
    arrayOfPokemonsName.forEach(() => {
      fireEvent.click(nextPokemonButton);
    });
    expect(getByText(arrayOfPokemonsName[0])).toBeInTheDocument();
  };

  test('5.2 - After clicking it, it should return to the initial state', () => {
    func5(false);
  });

  test('5.3 - By default, it starts with all filter selected', () => {
    func5(true);
  });
});

const pokemonsFiltered = () => fakePokemons.filter(({ type }) => type === 'Electric' || type === 'Fire'
  || type === 'Normal' || type === 'Psychic');

describe('Teste 6 - Generate dinamic button to type', () => {
  test('6.1 - Generate dinamic button to type', () => {
    const { getByText, getAllByText, queryByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex
          pokemons={pokemonsFiltered()}
          isPokemonFavoriteById={booleanFavoritedPokemons}
        />
      </MemoryRouter>,
    );
    expect(getAllByText('Electric')[1]).toBeInTheDocument();
    expect(getByText('Normal')).toBeInTheDocument();
    expect(getByText('Psychic')).toBeInTheDocument();
    expect(getByText('Fire')).toBeInTheDocument();
    expect(queryByText('Bug')).not.toBeInTheDocument();
  });
});

describe('Teste 7 - Button disabled if only one Pokemon', () => {
  test('7.1 - Button disabled if only one Pokemon', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    fireEvent.click(getByText('Poison'));
    expect(nextPokemonButton.disabled).toBeTruthy();
    fireEvent.click(getByText('Psychic'));
    expect(nextPokemonButton.disabled).toBeFalsy();
  });
});

describe('Teste 8 - Pokedex should show name, type, average weight and image', () => {
  test('8.1 - Showing name, type and average weight', () => {
    const { getByText, getAllByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex
          pokemons={fakePokemons}
          isPokemonFavoriteById={booleanFavoritedPokemons}
        />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    fakePokemons.forEach(({ name, type, averageWeight: { value, measurementUnit } }) => {
      const pokemonName = getByText(name);
      const pokemonType = getAllByText(type)[0];
      const pokemonWeigth = getByText(`Average weight: ${value} ${measurementUnit}`);
      expect(pokemonName).toBeInTheDocument();
      expect(pokemonType).toBeInTheDocument();
      expect(pokemonWeigth).toBeInTheDocument();
      fireEvent.click(nextPokemonButton);
    });
  });
  test('8.2 - Showing image', () => {
    const { getByAltText, getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex
          pokemons={fakePokemons}
          isPokemonFavoriteById={booleanFavoritedPokemons}
        />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    fakePokemons.forEach(({ name, image }) => {
      const pokemonImage = getByAltText(`${name} sprite`);
      expect(pokemonImage).toBeInTheDocument();
      expect(pokemonImage.src).toBe(image);
      fireEvent.click(nextPokemonButton);
    });
  });
});

describe('Teste 9 - Rendering a nav bar', () => {
  test('9.1 - nav link to id', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    fakePokemons.forEach(({ id }) => {
      const moreDetail = getByText('More details');
      expect(moreDetail).toBeInTheDocument();
      expect(moreDetail.href).toBe(`http://localhost/pokemons/${id}`);
      fireEvent.click(nextPokemonButton);
    });
  });
});

describe('Teste 16 - favorite Page', () => {
  test('16.1 - favorited pokemons should be marked with a start with an alt message', () => {
    const { getByText, getByAltText, queryByAltText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Pokedex
          pokemons={fakePokemons}
          isPokemonFavoriteById={booleanFavoritedPokemons}
        />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    fakePokemons.forEach(({ name, id }) => {
      if (booleanFavoritedPokemons[id]) {
        expect(getByAltText(`${name} is marked as favorite`)).toBeInTheDocument();
        expect(getByAltText(`${name} is marked as favorite`).src).toBe('http://localhost/star-icon.svg');
      } else {
        expect(queryByAltText(`${name} is marked as favorite`)).not.toBeInTheDocument();
      }
      fireEvent.click(nextPokemonButton);
    });
  });
});

describe('Teste 17 - Fixed links at nav bar', () => {
  test('17.1 - At top of the app, it should have fixed links', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const home = getByText('Home');
    expect(home).toBeInTheDocument();
    expect(home.href).toBe('http://localhost/');
    const about = getByText('About');
    expect(about).toBeInTheDocument();
    expect(about.href).toBe('http://localhost/about');
    const favPokemons = getByText('Favorite Pokémons');
    expect(favPokemons).toBeInTheDocument();
    expect(favPokemons.href).toBe('http://localhost/favorites');
  });
});

function renderWithRouter(
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {},
) {
  const Wrapper = ({ children }) => (
    <Router history={history}>{children}</Router>
  );
  return {
    ...render(ui, { wrapper: Wrapper }),
    history,
  };
}

describe('Testes 18, 19, 20 - testing nav links', () => {
  test('18, 19 and 20 - testing header links', () => {
    const { getByText, history } = renderWithRouter(
      <App />,
    );
    fireEvent.click(getByText('Home'));
    expect(history.location.pathname).toBe('/');
    fireEvent.click(getByText('About'));
    expect(history.location.pathname).toBe('/about');
    fireEvent.click(getByText('Favorite Pokémons'));
    expect(history.location.pathname).toBe('/favorites');
  });
});

describe('21 - Page about should have Pokedex infos', () => {
  test('21.1 - Page about must contain a heading with text "About Pokédex"', () => {
    const { getByText } = renderWithRouter(<App />, {
      route: '/about',
    });
    expect(getByText('About Pokédex')).toBeInTheDocument();
    expect(getByText('About Pokédex').tagName).toBe('H2');
  });
  test('21.2 - The About Page should have two paragraphs', () => {
    const { getByText } = renderWithRouter(<App />, {
      route: '/about',
    });
    expect(getByText(/This application simulates a Pokédex, a digital encliclopedia containing all Pokémons/)).toBeInTheDocument();
    expect(getByText(/One can filter Pokémons by type, and see more details for each one of them/)).toBeInTheDocument();
  });
  test('21.3 - Getting the right img path', () => {
    const { getByAltText } = renderWithRouter(<App />, {
      route: '/about',
    });
    expect(getByAltText('Pokédex').src).toBe('https://cdn.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png');
  });
});

describe('22 - Favorite pokemons page should render the favorite pokemons', () => {
  test('22.1 - Showing only the favorited pokemons', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <FavoritePokemons
          pokemons={arrayFavoritedpokemons}
        />
      </MemoryRouter>,
    );
    arrayFavoritedpokemons.forEach(({ name }) => {
      expect(getByText(name)).toBeInTheDocument();
    });
  });
  test('22.2 - Not showing the not favorited pokemons', () => {
    const { queryByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <FavoritePokemons
          pokemons={arrayFavoritedpokemons}
        />
      </MemoryRouter>,
    );
    arrayNotFavoritedpokemons.forEach(({ name }) => {
      expect(queryByText(name)).not.toBeInTheDocument();
    });
  });
});

describe('23 - Render the 404 not Found page', () => {
  test('23.1 - heading H2 with text "Page requested not found 😭"', () => {
    const history = createMemoryHistory();
    history.push('/wrong/location');
    const { getByText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    expect(getByText(/Page requested not found/)).toBeInTheDocument();
    expect(getByText(/Page requested not found/).tagName).toBe('H2');
  });
  test('23.2 - Page Not Found shoul render an image', () => {
    const history = createMemoryHistory();
    history.push('/wrong/location');
    const { getByAltText } = render(
      <Router history={history}>
        <App />
      </Router>,
    );
    const imgPikachu = getByAltText('Pikachu crying because the page requested was not found');
    expect(imgPikachu.src).toBe('https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif');
  });
});
