import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import App from '../App';
import Pokedex from './Pokedex';
import pokemons from '../data';

afterEach(cleanup);

const arrayOfPokemonsName = pokemons.reduce((pv, cv) => {
  pv.push(cv.name);
  return pv;
}, []);

const arrayOfPokemonsTypes = pokemons.reduce((pv, cv) => {
  pv.push(cv.type);
  return pv;
}, []);

const pokemonsFiltered = () => pokemons.filter(({ type }) => {
  return (type === 'Electric' || type === 'Fire' || type === 'Normal' || type === 'Psychic');
});

const Pokemonfavorited = {
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


test('2 - Pokedex shows only one pokemon each time', () => {
  const { getAllByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );
  const moreDetailLength = getAllByText('More details').length;
  expect(moreDetailLength).toBe(1);
});

describe('3 - onClick shows the next Pokemon', () => {
  test('3.1 - The button must contain "Proximo Pokémon"', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    expect(nextPokemonButton).toBeInTheDocument();
  });
  test('3.2 - Sequential clicks should change for the next Pokemon', () => {
    const nPokemons = arrayOfPokemonsName.length;
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    for (let i = 0; i < nPokemons; i += 1) {
      const pokemonName = getByText(arrayOfPokemonsName[i]);
      expect(pokemonName).toBeInTheDocument();
      fireEvent.click(nextPokemonButton);
    }
  });
  test('3.3 - After the last pokemon, it should go back to the first one', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    arrayOfPokemonsName.forEach(() => fireEvent.click(nextPokemonButton));
    const pokemonName = getByText(arrayOfPokemonsName[0]);
    expect(pokemonName).toBeInTheDocument();
  });
});

describe('4 - Pokedex should contain filter buttons', () => {
  test('4.1 - Type filter should select only the pokemons with respective type', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const allPokemonTypes = [...new Set(arrayOfPokemonsTypes)];
    const nextPokemonButton = getByText('Próximo pokémon');
    let typeButton = getByText(allPokemonTypes[1]);
    fireEvent.click(typeButton);
    allPokemonTypes.forEach((tipo) => {
      typeButton = getByText(tipo);
      fireEvent.click(typeButton);
      const nomesPokemonsTipos = pokemons.filter((e) => e.type === tipo);
      for (let i = 0; i < nomesPokemonsTipos.length; i += 1) {
        const pokemonName = getByText(nomesPokemonsTipos[i].name);
        expect(pokemonName).toBeInTheDocument();
        if (nomesPokemonsTipos.length > 1) fireEvent.click(nextPokemonButton);
      }
    });
  });
  test('4.2 - The button text should be the name of the type', () => {
    const { getByText, getAllByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    arrayOfPokemonsTypes.forEach((tipo) => {
      const btnNameType = getAllByText(tipo)[1] || getByText(tipo);
      expect(btnNameType).toBeInTheDocument();
    });
  });
});

describe('5 - Pokedex should contain reset button filter', () => {
  test('5.1 - The text should be "All"', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(getByText('All')).toBeInTheDocument();
  });
  const func5 = (estadoinicial) => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
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

test('6 - Generate dinamic button to type', () => {
  const { getByText, getAllByText, queryByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <Pokedex
        pokemons={pokemonsFiltered()}
        isPokemonFavoriteById={Pokemonfavorited}
      />
    </MemoryRouter>,
  );
  expect(getAllByText('Electric')[1]).toBeInTheDocument();
  expect(getByText('Normal')).toBeInTheDocument();
  expect(getByText('Psychic')).toBeInTheDocument();
  expect(getByText('Fire')).toBeInTheDocument();
  expect(queryByText('Bug')).not.toBeInTheDocument();
});

test('7 - Button disabled if only one Pokemon', () => {
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

describe('8 - Pkedex should show name, type, average weight and image', () => {
  test('8.1 - Showing name, type and average weight', () => {
    const { getByText, getAllByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    pokemons.forEach(({ name, type, averageWeight: { value, measurementUnit } }) => {
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
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    pokemons.forEach(({ name, image }) => {
      const pokemonImage = getByAltText(`${name} sprite`);
      expect(pokemonImage).toBeInTheDocument();
      expect(pokemonImage.src).toBe(image);
      fireEvent.click(nextPokemonButton);
    });
  });
});

describe('9 - Nav link to show details', () => {
  test('9.1 - nav link to id', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const nextPokemonButton = getByText('Próximo pokémon');
    pokemons.forEach(({ id }) => {
      const moreDetail = getByText('More details');
      expect(moreDetail).toBeInTheDocument();
      expect(moreDetail.href).toBe(`http://localhost/pokemons/${id}`);
      fireEvent.click(nextPokemonButton);
    });
  });
});

const detailedExibition = (ex) => {
  const {
    getByText, getByAltText, queryByText, getAllByAltText, getByLabelText, queryByAltText,
  } = render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );
  pokemons.map(({
    name, type, averageWeight: { value, measurementUnit }, image, summary, foundAt,
  }, index) => {
    for (let i = 0; i < index; i += 1) {
      const nextPokemonButton = getByText('Próximo pokémon');
      fireEvent.click(nextPokemonButton);
    }
    const moreDetail = getByText('More details');
    fireEvent.click(moreDetail);
    if (ex === 10) expect(getByText(`${name} Details`)).toBeInTheDocument();
    if (ex === 11) {
      expect(getByText(name)).toBeInTheDocument();
      expect(getByText(type)).toBeInTheDocument();
      expect(getByText(`Average weight: ${value} ${measurementUnit}`)).toBeInTheDocument();
      expect(getByAltText(`${name} sprite`).src).toBe(image);
    }
    if (ex === 12) expect(queryByText('More details')).not.toBeInTheDocument();
    if (ex === 13) {
      expect(getByText('Summary')).toBeInTheDocument();
      expect(getByText('Summary').tagName).toBe('H2');
      expect(getByText(summary)).toBeInTheDocument();
      expect(getByText(summary).tagName).toBe('P');
    }
    if (ex === 14) {
      expect(getByText(`Game Locations of ${name}`)).toBeInTheDocument();
      expect(getByText(`Game Locations of ${name}`).tagName).toBe('H2');
      expect(getAllByAltText(`${name} location`).length).toBe(foundAt.length);
      for (let i = 0; i < foundAt.length; i += 1) {
        const location = getAllByAltText(`${name} location`)[i];
        expect(location.src).toBe(foundAt[i].map);
        expect(getByText(foundAt[i].location)).toBeInTheDocument();
      }
    }
    if (ex === 15) {
      expect(getByLabelText('Pokémon favoritado?')).toBeInTheDocument();
      const eMarcado = queryByAltText(`${name} is marked as favorite`);
      if (eMarcado) {
        fireEvent.click(getByLabelText('Pokémon favoritado?'));
      }
      expect(queryByAltText(`${name} is marked as favorite`)).not.toBeInTheDocument();
      fireEvent.click(getByLabelText('Pokémon favoritado?'));
      expect(queryByAltText(`${name} is marked as favorite`)).toBeInTheDocument();
      fireEvent.click(getByLabelText('Pokémon favoritado?'));
      expect(queryByAltText(`${name} is marked as favorite`)).not.toBeInTheDocument();
    }
    fireEvent.click(getByText('Home'));
  });
};

describe('10 - Changing to detail page', () => {
  test('10.1 - The URL should change', () => {
    pokemons.forEach(({ id, name }) => {
      const history = createMemoryHistory();
      history.push(`/pokemons/${id}`);
      const { getByText } = render(
        <Router history={history}>
          <App />
        </Router>,
      );
      const pokemonDetails = getByText(`${name} Details`);
      expect(pokemonDetails).toBeInTheDocument();
      expect(history.location.pathname).toBe(`/pokemons/${id}`);
    });
  });
  test('10.2 - Clicking on "More Details redirects the page', () => {
    detailedExibition(10);
  });
});

describe('11 - Detail Page should render name, type, average weight and image', () => {
  test('11.1 and 11.2 - testing name, type, average weight and image', () => {
    detailedExibition(11);
  });
});

test('12 - The pokemon at detailed page should not have a link to "More details"', () => {
  detailedExibition(12);
});

test('13 - The pokemon at detailed page should have a heading summary and a p', () => {
  detailedExibition(13);
});

test('14 - The pokemon at detailed page should have ssetions with locations', () => {
  detailedExibition(14);
});

test('15 - Clicking on star icon to make Pokemon favorite', () => {
  detailedExibition(15);
});
