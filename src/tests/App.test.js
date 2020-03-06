import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { render, cleanup, fireEvent, getAllByAltText, getByAltText } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import App from '../App';
import Pokemon from '../data';

afterEach(cleanup);

test.skip('renders a reading with the text `Pokédex`', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const heading = getByText(/Pokédex/i);
  expect(heading).toBeInTheDocument();
});

test.skip('1- shows the Pokedéx when the route is `/`', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );

  expect(getByText('Encountered pokémons')).toBeInTheDocument();
});

test.skip('2- shows only one Pokemon on render', () => {
  const { getAllByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );
  const onePokemon = getAllByText('More details').length;
  expect(onePokemon).toBe(1);
});

describe.skip('3- After clicking next, the page must exhibit the next pokemon from list', () => {
  test('3.1 - The button must contain "Proximo Pokémon"', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    expect(nextPokemonButton).toBeInTheDocument();
  });
  test('3.2 - Succeeding clicks must show the next pokemon from the list', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    const pokeName = Pokemon.map((data) => data.name);
    for (let i = 0; i < pokeName.length; i += 1) {
      expect(getByText(pokeName[i])).toBeInTheDocument();
      fireEvent.click(nextPokemonButton);
    }
  });
  test('3.3 - when showing the last pokemon on the list, Pokedex must go back to the first pokemon after clicking its button.', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    const allPoke = Pokemon.length + 1;
    const pokeName = Pokemon.map((data) => data.name);
    for (let i = 0; i < allPoke; i += 1) {
      fireEvent.click(nextPokemonButton);
      if (i === allPoke) {
        expect(getByText(pokeName[0])).toBeInTheDocument();
      }
    }
  });
});

describe.skip('4- Pokedéx must contain filter buttons', () => {
  test('4.1- Starting from one type to another, Pokedéx must show only pokemons from that type', () => {
    const { getByText, getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const PokeType = ['Electric', 'Fire', 'Bug', 'Poison', 'Psychic', 'Normal', 'Dragon'];
    PokeType.forEach((tipo) => {
      const typeList = Pokemon.filter((data) => data.type === tipo);
      const buttonType = getByTestId(tipo);
      const nextPokemonButton = getByText('Próximo pokémon');
      fireEvent.click(buttonType);
      for (let i = 0; i < typeList.length; i += 1) {
        expect(getByText(typeList[i].name)).toBeInTheDocument();
        fireEvent.click(nextPokemonButton);
      }
    });
  });
  test("4.2- Button's text must have the same name as type", () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const PokeType = ['Electric', 'Fire', 'Bug', 'Poison', 'Psychic', 'Normal', 'Dragon'];
    PokeType.forEach((tipo) => {
      const buttonType = getByTestId(tipo);
      expect(buttonType.innerHTML).toEqual(tipo);
    });
  });
});
describe.skip('5- Pokédex must have a button to reset filters', () => {
  test("5.1- Button's text must be 'All'", () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const resetButton = getByTestId('All');
    expect(resetButton.innerHTML).toEqual('All');
  });
  test('5.2- After clicking it, Pokédex must cicle around all pokémons', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const resetButton = getByTestId('All');
    const typeList = Pokemon.filter((data) => data.type);
    fireEvent.click(resetButton);
    expect(typeList.length).toEqual(Pokemon.length);
  });
  test('5.3- When page renders, the selected filter must be "all"', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    Pokemon.forEach((data) => {
      expect(getByText(data.name)).toBeInTheDocument();
      fireEvent.click(nextPokemonButton);
    });
  });
});
test.skip('6- Pokédex must generate, dinamically, a filter button for every pokémon type', () => {
  const { getByTestId, getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );
  const PokeTypeList = ['All', 'Electric', 'Fire', 'Bug', 'Poison', 'Psychic', 'Normal', 'Dragon'];
  const nextPokemonButton = getByText('Próximo pokémon');
  for (let i = 0; i < Pokemon.length; i += 1) {
    expect(getByText(Pokemon[i].name)).toBeInTheDocument();
    fireEvent.click(nextPokemonButton);
  }
  PokeTypeList.forEach((tipo) => {
    const buttonType = getByTestId(tipo);
    const typeList = Pokemon.filter((poketype) => poketype.type === tipo);
    fireEvent.click(buttonType);
    for (let i = 0; i < typeList.length; i += 1) {
      expect(getByText(typeList[i].name)).toBeInTheDocument();
      fireEvent.click(nextPokemonButton);
    }
  });
});
test.skip('7- Button "Próximo Pokémon" must be disabled if the filtered list has only one pokémon', () => {
  const { getByTestId, getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );
  const nextPokemonButton = getByText('Próximo pokémon');
  const PokeType = ['Electric', 'Fire', 'Bug', 'Poison', 'Psychic', 'Normal', 'Dragon'];
  PokeType.forEach((tipo) => {
    const typeList = Pokemon.filter((data) => data.type === tipo);
    const buttonType = getByTestId(tipo);
    fireEvent.click(buttonType);
    if (typeList.length === 1) {
      expect(nextPokemonButton).toBeDisabled();
    }
  });
});
test.skip('8- Pokedéx must exhibit name, type, averageweight and image from current pokémon', () => {
  const { queryByAltText, queryByText, getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const nextPokemonButton = getByText('Próximo pokémon');
  Pokemon.forEach((poke) => {
    const { value, measurementUnit } = poke.averageWeight;
    expect(queryByText(`Average weight: ${value} ${measurementUnit}`)).toBeInTheDocument();
    expect(queryByAltText(`${poke.name} sprite`)).toBeInTheDocument();
    expect(Pokemon.some((elemen) => elemen.image === queryByAltText(`${poke.name} sprite`).src)).toBeTruthy();
    fireEvent.click(nextPokemonButton);
  });
});
test.skip("9- Verify if there's a link named 'more details' on pokemon section", () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const pokeName = Pokemon.map((data) => data.id);
  const moreDetailsButton = getByText('More details');
  expect(moreDetailsButton).toBeInTheDocument();
  expect((moreDetailsButton).closest('a'));
  expect(moreDetailsButton).toHaveAttribute('href', `/pokemons/${pokeName[0]}`);
});
test.skip("10- When clicking on pokemón's navigation link, the application must be redirected to pokémon's detail page", () => {
  const history = createMemoryHistory();
  const { getByText } = render(
    <Router history={history}>
      <App />
    </Router>,
  );
  const moreDetailsButton = getByText('More details');
  fireEvent.click(moreDetailsButton);
  expect(history.location.pathname).toBe('/pokemons/25');
});
test.skip("11- Pokemon details' page must exhibit name, type, average weight and image from chosen pokemon", () => {
  const { getByText, queryByText, queryByAltText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const moreDetailsButton = getByText('More details');
  fireEvent.click(moreDetailsButton);
  const { value, measurementUnit } = Pokemon[0].averageWeight;
  expect(queryByText(`Average weight: ${value} ${measurementUnit}`)).toBeInTheDocument();
  expect(queryByAltText(`${Pokemon[0].name} sprite`)).toBeInTheDocument();
  expect(queryByAltText(`${Pokemon[0].name} sprite`).src).toBeTruthy();
});
test.skip('12- The shown Pokémon must not contain a navigation link to show more details about this pokemon', () => {
  const history = createMemoryHistory();
  const { getByText, queryByText } = render(
    <Router history={history}>
      <App />
    </Router>,
  );
  const moreDetailsButton = getByText('More details');
  fireEvent.click(moreDetailsButton);
  expect(queryByText('More details')).toBeNull();
});
test.skip("13- Details' page must show a section with the chosen pokemon's summary", () => {
  const history = createMemoryHistory();
  const { getByText, getByTestId } = render(
    <Router history={history}>
      <App />
    </Router>,
  );
  const moreDetailsButton = getByText('More details');
  fireEvent.click(moreDetailsButton);
  const checkSummary = getByText('Summary');
  const checkText = getByTestId('pokemon-summary');
  expect((checkSummary).closest('h2'));
  expect(checkText).toBeInTheDocument();
});
test.skip("14- Details page must show a section with the Pokemon's game locations' maps", () => {
  const history = createMemoryHistory();
  const { getByText, getByTestId, queryByText } = render(
    <Router history={history}>
      <App />
    </Router>,
  );
  const moreDetailsButton = getByText('More details');
  fireEvent.click(moreDetailsButton);
  const pokeName = getByText(Pokemon[0].name);
  expect(pokeName).toBeInTheDocument();
  const gameLocation = getByText(`Game Locations of ${Pokemon[0].name}`);
  expect(gameLocation).toBeInTheDocument();
  const { name, foundAt } = Pokemon[0];
  foundAt.forEach(({ location, map }) => {
    expect(queryByText(location)).toBeInTheDocument();
    expect(getByTestId(location).src).toBe(map);
    expect(getByTestId(location).alt).toBe(`${name} location`);
  });
});
test.skip('15, 16- Details page must allow to check a pokemon as favorite', () => {
  const history = createMemoryHistory();
  const { getByText, getByTestId, getByLabelText } = render(
    <Router history={history}>
      <App />
    </Router>,
  );
  const moreDetailsButton = getByText('More details');
  fireEvent.click(moreDetailsButton);
  const favoriteButton = getByTestId('favorite-button');
  expect(favoriteButton).toBeInTheDocument();
  expect(getByLabelText('Pokémon favoritado?')).toBeInTheDocument();
  fireEvent.click(favoriteButton);
  const favoriteIcon = getByTestId('favorite-icon');
  expect(favoriteIcon).toBeInTheDocument();
  expect(favoriteIcon).toHaveAttribute('src', '/star-icon.svg');
  expect(favoriteIcon).toHaveAttribute('alt', 'Pikachu is marked as favorite');
});
test('17', () => {
  const history = createMemoryHistory();
  const { getByText } = render(
    <Router history={history}>
      <App />
    </Router>,
  );
  expect(getByText('Home', { selector: 'a' })).toBeInTheDocument();
  expect(getByText('Home').href).toBe('http://localhost/');
  expect(getByText('About', { selector: 'a' })).toBeInTheDocument();
  expect(getByText('About').href).toBe('http://localhost/about');
  expect(getByText('Favorite Pokémons', { selector: 'a' })).toBeInTheDocument();
  expect(getByText('Favorite Pokémons').href).toBe('http://localhost/favorites');
});
test('18', () => {
  const history = createMemoryHistory();
  const { getByText } = render(
    <Router history={history}>
      <App />
    </Router>,
  );
  const homeButton = getByText('Home', { selector: 'a' });
  fireEvent.click(homeButton);
  expect(history.location.pathname).toBe('/');
});
test('19', () => {
  const history = createMemoryHistory();
  const { getByText } = render(
    <Router history={history}>
      <App />
    </Router>,
  );
  const aboutButton = getByText('About', { selector: 'a' });
  fireEvent.click(aboutButton);
  expect(history.location.pathname).toBe('/about');
});
test('20', () => {
  const history = createMemoryHistory();
  const { getByText } = render(
    <Router history={history}>
      <App />
    </Router>,
  );
  const favoritesButton = getByText('Favorite Pokémons', { selector: 'a' });
  fireEvent.click(favoritesButton);
  expect(history.location.pathname).toBe('/favorites');
});
test('21', () => {
  const history = createMemoryHistory();
  const { getByText, getByTestId } = render(
    <Router history={history}>
      <App />
    </Router>,
  );
  const aboutButton = getByText('About');
  fireEvent.click(aboutButton);
  const aboutHeader = getByTestId('about');
  expect((aboutHeader).closest('h2'));
});
test('23', () => {
  const { getByText, getByAltText } = render(
    <MemoryRouter initialEntries={['/digimon']}>
      <App />
    </MemoryRouter>,
  );
  const notFound = getByText(/Page requested not found/);
  expect((notFound).closest('h2'));
  expect(notFound).toBeInTheDocument();
  const pikachuGif = getByAltText('Pikachu crying because the page requested was not found');
  expect(pikachuGif).toBeInTheDocument();
});
