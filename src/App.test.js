import React from 'react';
import { Router, MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history'
import { render, cleanup, fireEvent, queryAllByTestId } from '@testing-library/react';
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

test ('14 - Details page needs show a section with maps and localization of pokemons', () => {
  const { queryAllByAltText, history, getByText } = renderWithRouter(<App />);

  pokemons.forEach((pokemon, index) => {
    const { name, foundAt } = pokemon;
    fireEvent.click(getByText('More details'));
    expect(getByText(`Game Locations of ${name}`, {selector: 'h2'})).toBeInTheDocument();
    foundAt.forEach((data, index) => {
      const { location, map } = data;
      expect(getByText(location)).toBeInTheDocument();
      const imageAlt = queryAllByAltText(`${name} location`)[index];
      expect(imageAlt).toBeInTheDocument();
      expect(map).toStrictEqual(imageAlt.src);
      expect(getByText(location)).toBeInTheDocument();
    })
    history.push('/');
    for (let i = 0; i <= index; i += 1) {
      fireEvent.click(getByText('Próximo pokémon'));
    }
  });
})

test ('15 - In details page, you can favorite a pokemon', () => {
  const { getByTestId, history, getByText } = renderWithRouter(<App />);

  pokemons.forEach((index) => {
    fireEvent.click(getByText('More details'));
    const checkBox = getByTestId('checkbox', {selector: 'input'});
    expect(checkBox).toBeInTheDocument();
    fireEvent.click(checkBox);
    expect(checkBox).toBeChecked();
    fireEvent.click(checkBox);
    expect(checkBox).not.toBeChecked();
    history.push('/');
    for (let i = 0; i <= index; i += 1) {
      fireEvent.click(getByText('Próximo pokémon'));
    }
  });
})

test ('16 - When favorite input is clicked, details page shows a star img', () => {
  const { getByTestId, history, getByText, getAllByRole } = renderWithRouter(<App />);

  pokemons.forEach((index) => {
    fireEvent.click(getByText('More details'));
    const checkBox = getByTestId('checkbox', {selector: 'input'});
    expect(checkBox).toBeInTheDocument();
    fireEvent.click(checkBox);
    let imgArr = getAllByRole('img');
    let starChecked = imgArr.find((imagem) => imagem.src === "http://localhost/star-icon.svg");
    expect(checkBox).toBeChecked();
    expect(starChecked).toBeInTheDocument();
    fireEvent.click(checkBox);
    expect(checkBox).not.toBeChecked();
    expect(starChecked).not.toBeInTheDocument();
    history.push('/');
    for (let i = 0; i <= index; i += 1) {
      fireEvent.click(getByText('Próximo pokémon'));
    }
  });
})

test ('17 - The top of page need shows a fix link to navigate', () => {
  const { getByText } = renderWithRouter(<App />);

  const home = getByText(/Home/i, {selector: 'a'});
  const about = getByText(/About/i, {selector: 'a'});
  const favoritePkmn = getByText(/Favorite Pokémons/i, {selector: 'a'});
  expect(home).toBeInTheDocument();
  expect(about).toBeInTheDocument();
  expect(favoritePkmn).toBeInTheDocument();
  expect(home.href).toStrictEqual('http://localhost/');
  expect(about.href).toStrictEqual('http://localhost/about');
  expect(favoritePkmn.href).toStrictEqual('http://localhost/favorites');
})

test ('18 - When click on Home, app need redirect to URL /', () => {
  const { getByText, history } = renderWithRouter(<App />);

  const home = getByText(/Home/i, {selector: 'a'});
  expect(home).toBeInTheDocument();
  fireEvent.click(home);
  expect(history.location.pathname).toStrictEqual('/');
})

test ('19 - When click on About, app need redirect to URL /about', () => {
  const { getByText, history } = renderWithRouter(<App />);

  const about = getByText(/About/i, {selector: 'a'});
  expect(about).toBeInTheDocument();
  fireEvent.click(about);
  expect(history.location.pathname).toStrictEqual('/about');
})

test ('20 - When click on Favorite Pokémons, app need redirect to URL /favorites', () => {
  const { getByText, history } = renderWithRouter(<App />);

  const favoritePkmn = getByText(/Favorite Pokémons/i, {selector: 'a'});
  expect(favoritePkmn).toBeInTheDocument();
  fireEvent.click(favoritePkmn);
  expect(history.location.pathname).toStrictEqual('/favorites');
})

test ('21 - About page need shows info about Pokedex', () => {
  const { getByText, getAllByTestId } = renderWithRouter(<App />);

  const about = getByText(/About/i, {selector: 'a'});
  fireEvent.click(about);
  const aboutH2 = getByText('About Pokédex');
  expect(aboutH2).toBeInTheDocument();
  expect(aboutH2.tagName).toStrictEqual('H2');
  const image = getAllByTestId('imagePokedex')[0];
  expect(image).toBeInTheDocument();
  expect(image.src).toStrictEqual('https://cdn.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png')
  const paragraf = getAllByTestId('paragraf');
  paragraf.forEach((paragraph) => {
    expect(paragraph).toBeInTheDocument();
  });
  expect(document.getElementsByTagName('p').length).toStrictEqual(2);
})

test ('23 - Unknown URL shows a Page requested not found in h2', () => {
  const { history, getByText, getByTestId } = renderWithRouter(<App />);

  history.push('/teste');
  const notFoundH2 = getByText(/Page requested not found/i, {selector: 'h2'});
  expect(notFoundH2).toBeInTheDocument();
  expect(notFoundH2.tagName).toStrictEqual('H2');
  const notFoundImg = getByTestId('notFoundImage');
  expect(notFoundImg).toBeInTheDocument();
  expect(notFoundImg.src).toStrictEqual('https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif');
})
