import React from 'react';
import { Router, MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history'
import { render, cleanup, fireEvent } from '@testing-library/react';
import pokemons from './types/mockPokemons';
import App from './App';
import '@testing-library/jest-dom'

function renderWithRouter(
  ui,
  { route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {},
) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    history,
  };
}

afterEach(cleanup)

test('1 - renders a reading with the text `Pokédex`', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const heading = getByText(/Pokédex/i);
  expect(heading).toBeInTheDocument();
});

test('2 - shows the Pokedéx when the route is `/`', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={[{ pathname: "/" }]}>
      <App />
    </MemoryRouter>,
  );

  expect(getByText('Encountered pokémons')).toBeInTheDocument();
});

test('3 - show next Pokemon when click on button - Próximo pokémon -', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  
  const buttonNxtPkm = getByText(/Próximo pokémon/i, {selector: 'button'});
  expect(buttonNxtPkm).toBeInTheDocument();
  pokemons.forEach((pokemon) => {
    expect(getByText(pokemon.name)).toBeInTheDocument();
    fireEvent.click(buttonNxtPkm);
  });
  expect(getByText(pokemons[0].name)).toBeInTheDocument();
})

test('4 - Pokedex need filters to map each pokemon by type', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  const buttonNxtPkm = getByText(/Próximo pokémon/i, {selector: 'button'});
  const typesfiltered = [...new Set(pokemons.map((pokemon) =>  pokemon.type))];
  typesfiltered.forEach((type) => {
    expect(getByText(type, {selector: 'button'})).toBeInTheDocument();
    fireEvent.click(getByText(type, {selector: 'button'}));
    const pkmnFiltered = pokemons.filter((pokemon) => pokemon.type === type);
    if (pkmnFiltered.length > 1) {
      for (let i = 0; pkmnFiltered.length > i; i += 1) {
        const pkmnMapped = pokemons.filter((pokemon) => pokemon.type === type);
        expect(getByText(pkmnMapped[i].name, {selector: 'p'})).toBeInTheDocument();
        fireEvent.click(buttonNxtPkm);
      }
    }
  });
})

test('5 - Pokedex needs a button All to reset filter', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  const buttonAll = getByText(/All/i, {selector: 'button'});
  const buttonNxtPkm = getByText(/Próximo pokémon/i, {selector: 'button'});
  expect(buttonAll).toBeInTheDocument();
  fireEvent.click(buttonAll);
  pokemons.forEach((pokemon) => {
    expect(getByText(pokemon.name)).toBeInTheDocument();
    fireEvent.click(buttonNxtPkm);
  });
})

test('6 - Pokedex needs to generate a filter button for each type of pokemon', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  
  const buttonAll = getByText(/All/i, {selector: 'button'});
  const typesfiltered = [...new Set(pokemons.map((pokemon) =>  pokemon.type))];
  const buttonNxtPkm = getByText(/Próximo pokémon/i, {selector: 'button'});
  typesfiltered.forEach((type) => {
    expect(getByText(type, {selector: 'button'})).toBeInTheDocument();
    fireEvent.click(getByText(type, {selector: 'button'}));
    expect(buttonAll).toBeInTheDocument();
  });
  fireEvent.click(buttonAll);
  pokemons.forEach((pokemon) => {
    expect(getByText(pokemon.name)).toBeInTheDocument();
    fireEvent.click(buttonNxtPkm);
  });
})

test('7 - Button - Próximo pokémon - needs to be disabled when there is only 1 type', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  const typesfiltered = [...new Set(pokemons.map((pokemon) =>  pokemon.type))];
  typesfiltered.forEach((type) => {
    const pkmnFiltered = pokemons.filter((pokemon) => pokemon.type === type);
    fireEvent.click(getByText(type, {selector: 'button'}));
    if (pkmnFiltered.length === 1) {
      const buttonNxtPkm = getByText(/Próximo pokémon/i, {selector: 'button'});
      expect(buttonNxtPkm).toBeDisabled();
    }
  });
})

test('8 - Pokedex need shows Name, Type, Average Weight and an Image of listed pokemon', () => {
  const { getByText, queryByText, getByAltText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  const buttonNxtPkm = getByText(/Próximo pokémon/i, {selector: 'button'});
  pokemons.forEach((pokemon) => {
    const { name, type, averageWeight: { value, measurementUnit }, image } = pokemon;
    const imageAlt = getByAltText(`${name} sprite`);
    expect(getByText(name)).toBeInTheDocument();
    expect(queryByText(type, { selector: 'p' })).toBeInTheDocument();
    expect(getByText(`Average weight: ${value} ${measurementUnit}`)).toBeInTheDocument();
    expect(imageAlt).toBeInTheDocument();
    expect(image).toStrictEqual(imageAlt.src);
    fireEvent.click(buttonNxtPkm);
  });
})

test('9 - Pokedex needs show a link do Pokemon Details with a unique ID', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  expect(getByText(/More details/i)).toBeInTheDocument();
  const buttonNxtPkm = getByText(/Próximo pokémon/i, {selector: 'button'});
  pokemons.forEach((pokemon) => {
    const { id } = pokemon;
    expect(getByText(/More details/i).href).toStrictEqual(`http://localhost/pokemons/${id}`);
    fireEvent.click(buttonNxtPkm);
  });
})

test('10 - Navigation link of pokemon More details needs show URL with id when clicked', () => {
  const history = createMemoryHistory();
  const { getByText } = render(
    <Router history={ history }>
      <App />
    </Router>,
  );

  pokemons.forEach((pokemon) => {
    const { id } = pokemon;
    history.push(`/pokemons/${id}`);
    expect(getByText(/Summary/i)).toBeInTheDocument();
    expect(history.location.pathname).toStrictEqual(`/pokemons/${id}`);
    history.push('/');
    fireEvent.click(getByText(/More details/i, {selector: 'a'}));
  });
})

test ('11 - Pokemon Details need shows name, type, average weight and image', () => {
  const history = createMemoryHistory();
  const { getByText, getByAltText, queryByText } = render(
    <Router history={ history }>
      <App />
    </Router>,
  );

  pokemons.forEach((pokemon) => {
    const { name, type, averageWeight: { value, measurementUnit }, image, id } = pokemon;
    history.push(`/pokemons/${id}`);
    expect(history.location.pathname).toStrictEqual(`/pokemons/${id}`);
    expect(getByText(`${name} Details`, {selector: 'h2'})).toBeInTheDocument();
    const imageAlt = getByAltText(`${name} sprite`);
    expect(getByText(name)).toBeInTheDocument();
    expect(queryByText(type, { selector: 'p' })).toBeInTheDocument();
    expect(getByText(`Average weight: ${value} ${measurementUnit}`)).toBeInTheDocument();
    expect(imageAlt).toBeInTheDocument();
    expect(image).toStrictEqual(imageAlt.src);
    history.push('/');
    const moreDetails = getByText(/More details/i, {selector: 'a'});
    fireEvent.click(moreDetails);
  });
})

test ('12 - Pokemon Details Page can not show a link do see Pokemon Details', () => {
  const { queryByText, history, getByText } = renderWithRouter(<App />);

  pokemons.forEach((index) => {
    fireEvent.click(getByText('More details'));
    const moreDetails = queryByText(/More details/i, {selector: 'a'});
    expect(moreDetails).toBeNull();
    history.push('/');
    for (let i = 0; i <= index; i += 1) {
      fireEvent.click(getByText('Próximo pokémon'));
    }
  });
})

test ('13 - Details page needs show a section of pokemon resume, h2 with text Summary', () => {
  const { container, history, getByText } = renderWithRouter(<App />);

  pokemons.forEach((pokemon, index) => {
    const { summary } = pokemon;
    fireEvent.click(getByText('More details'));
    const heading = container.querySelector('h2');
    expect(heading).toBeInTheDocument();
    expect(getByText(summary)).toBeInTheDocument();
    history.push('/');
    for (let i = 0; i <= index; i += 1) {
      fireEvent.click(getByText('Próximo pokémon'));
    }
  });
})
