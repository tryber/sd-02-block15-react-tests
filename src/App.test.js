import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { render, fireEvent, cleanup, getAllByRole, getByRole, getAllByTestId } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import App from './App';
import FavoritePokemons from './components/FavoritePokemons';
import pokemons from './data';

function renderWithRouter(
  ui,
  { route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {},
) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    history,
  };
}

afterEach(cleanup);

describe('0 - Teste inicial', () => {
  test('renders a reading with the text `Pokédex`', () => {
    const { getByText } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const heading = getByText(/Pokédex/i);
    expect(heading).toBeInTheDocument();
  });
});

describe('1 - Ao carregar a aplicação no caminho de URL “/”, a página principal da Pokédex deve ser mostrada', () => {
  test('shows the Pokedéx when the route is `/`', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
  
    expect(getByText('Encountered pokémons')).toBeInTheDocument();
  });
});

describe('2 - A Pokédex deve exibir apenas um pokémon por vez', () => {
  test('exibe apenas um pokémon na primeira renderização', () => {
    const { getAllByText, getAllByTestId } = renderWithRouter(<App />);
    const arrayAverageWeight = getAllByText(/Average weight:/);
    expect(arrayAverageWeight.length).toBe(1);

    const arrayMoreDetails = getAllByText('More details');
    expect(arrayMoreDetails.length).toBe(1);

    const arrayPokemonName = getAllByTestId('pokemon-name');
    expect(arrayPokemonName.length).toBe(1);

    const arrayPokemonType = getAllByTestId('pokemon-type');
    expect(arrayPokemonType.length).toBe(1);

    const arrayPokemonImage = getAllByTestId('pokemon-image');
    expect(arrayPokemonImage.length).toBe(1);
  });

  test('exibe apenas um pokémon ao clicar em vários botões aleatoriamente dentro da mesma página', () => {
    const { getAllByText, getAllByTestId } = renderWithRouter(<App />);

    const botoes = document.getElementsByTagName('button');

    for (let i = 0; i < 100; i += 1) {
      const indexAleatorio = Math.round(Math.random() * (botoes.length - 1));
      const botao = botoes[indexAleatorio];
  
      fireEvent.click(botao);
  
      const arrayAverageWeight = getAllByText(/Average weight:/);
      expect(arrayAverageWeight.length).toBe(1);
  
      const arrayMoreDetails = getAllByText('More details');
      expect(arrayMoreDetails.length).toBe(1);
  
      const arrayPokemonName = getAllByTestId('pokemon-name');
      expect(arrayPokemonName.length).toBe(1);
    
      const arrayPokemonType = getAllByTestId('pokemon-type');
      expect(arrayPokemonType.length).toBe(1);
    
      const arrayPokemonImage = getAllByTestId('pokemon-image');
      expect(arrayPokemonImage.length).toBe(1);
    }
  });
});

describe('3 - Ao apertar o botão de próximo, a página deve exibir o próximo pokémon da lista', () => {
  test('O botão deve conter o texto "Próximo pokémon"', () => {
    const { getByText } = renderWithRouter(<App />);

    const botaoProximoPokemon = getByText('Próximo pokémon');
    expect(botaoProximoPokemon).toBeInTheDocument();
  });

  test('Cliques sucessivos no botão devem mostrar o próximo pokémon da lista', () => {
    const { getByText } = renderWithRouter(<App />);

    const botaoProximoPokemon = getByText('Próximo pokémon');

    for (let i = 0; i < pokemons.length - 1; i += 1) {
      fireEvent.click(botaoProximoPokemon);

      expect(botaoProximoPokemon).toBeInTheDocument();

      const pokemonName = getByText(pokemons[i + 1].name);
      expect(pokemonName).toBeInTheDocument();
    }
  });

  test('Ao se chegar ao último pokémon da lista, a Pokédex deve voltar para o primeiro pokémon no apertar do botão', () => {
    const { getByText, queryByText } = renderWithRouter(<App />);

    const botaoProximoPokemon = getByText('Próximo pokémon');

    while (queryByText(pokemons[pokemons.length - 1].name) === null) {
      fireEvent.click(botaoProximoPokemon);
    }

    fireEvent.click(botaoProximoPokemon);

    expect(getByText(pokemons[0].name)).toBeInTheDocument();
  });
});

describe('4 - A Pokédex deve conter botões de filtro', () => {
  test('O texto do botão deve ser o nome do tipo, p. ex. Psychic', () => {
    const { getAllByText, getAllByTestId, getByText } = renderWithRouter(<App />);

    const arrayBotoesDeTipo = getAllByTestId('botao-de-tipo');
    const arrayTextosBotoes = arrayBotoesDeTipo.map((botao) => botao.innerHTML);
    const arrayPokemonTypes = Array.from( new Set(pokemons.map((pokemon) => pokemon.type)));

    arrayTextosBotoes.forEach((textoBotao) => {
      expect(getAllByText(textoBotao)[1] || getByText(textoBotao)).toBeInTheDocument();
      expect(arrayPokemonTypes).toContain(textoBotao);
    });
  
    expect(arrayPokemonTypes.length).toBe(arrayTextosBotoes.length);
  });

  test('A partir da seleção de um botão de tipo, a Pokédex deve circular somente pelos pokémons daquele tipo', () => {
    const { getAllByText, getAllByTestId, getByText } = renderWithRouter(<App />);

    const arrayBotoesDeTipo = getAllByTestId('botao-de-tipo');

    arrayBotoesDeTipo.forEach((botao) => {
      fireEvent.click(botao);
      expect(getAllByText(botao.innerHTML).length).toBe(2);

      for (let i = 0; i < 10; i += 1) {
        fireEvent.click(getByText('Próximo pokémon'));
        expect(getAllByText(botao.innerHTML).length).toBe(2);
      }
    });
  });
});

describe('5 - A Pokédex deve conter um botão para resetar o filtro', () => {
  test('O texto do botão deve ser "All"', () => {
    const { getByTestId } = renderWithRouter(<App />);

    const botaoAll = getByTestId('botao-all');

    expect(botaoAll).toBeInTheDocument();
    expect(botaoAll.innerHTML).toBe('All');
  });

  test('Após clicá-lo, a Pokédex deve voltar a circular por todos os pokémons', () => {
    const { getByText, getByTestId, getAllByTestId, getAllByText } = renderWithRouter(<App />);

    const arrayBotoesDeTipo = getAllByTestId('botao-de-tipo');
    const botaoAll = getByTestId('botao-all');

    arrayBotoesDeTipo.forEach((botaoDeTipo) => {
      fireEvent.click(botaoDeTipo);
      expect(getAllByText(botaoDeTipo.innerHTML).length).toBe(2);

      for (let i = 0; i < 10; i += 1) {
        fireEvent.click(getByText('Próximo pokémon'));
        expect(getAllByText(botaoDeTipo.innerHTML).length).toBe(2);
      }

      fireEvent.click(botaoAll);

      const primeiroPokemonName = getByText(pokemons[0].name);
      expect(primeiroPokemonName).toBeInTheDocument();

      const botaoProximoPokemon = getByText('Próximo pokémon');

      for (let i = 0; i < pokemons.length; i += 1) {
        fireEvent.click(botaoProximoPokemon);
        const proximoPokemonName = (i < (pokemons.length - 1)) ? getByText(pokemons[i + 1].name) : getByText(pokemons[0].name);
        expect(proximoPokemonName).toBeInTheDocument();
      }
    });
  });

  test('Quando a página carrega, o filtro selecionado deve ser o "All"', () => {
    const { getByText } = renderWithRouter(<App />);

    const primeiroPokemonName = getByText(pokemons[0].name);
    expect(primeiroPokemonName).toBeInTheDocument();

    const botaoProximoPokemon = getByText('Próximo pokémon');

    for (let i = 0; i < pokemons.length - 1; i += 1) {
      fireEvent.click(botaoProximoPokemon);

      const proximoPokemonName = (i < 8) ? getByText(pokemons[i + 1].name) : getByText(pokemons[0].name);
      expect(proximoPokemonName).toBeInTheDocument();
    }
  });
});

describe('6 - A Pokédex deve gerar, dinamicamente, um botão de filtro para cada tipo de pokémon', () => {
  test('Os botões de filtragem devem ser dinâmicos: sua Pokédex deve gerar um botão de filtragem para cada tipo de pokémon disponível nos dados independente de quais ou quantos sejam, sem repetição de tipos', () => {
    const { getAllByText, getByText } = renderWithRouter(<App />);

    const pokemonTypes = Array.from(new Set(pokemons.map((pokemon) => pokemon.type)));

    pokemonTypes.forEach((type) => {
      const botaoDeTipo = getAllByText(type)[1] || getByText(type);
      expect(botaoDeTipo).toBeInTheDocument();
      expect(getAllByText(type).length).toBeLessThanOrEqual(2);
    });
  });

  test('Além disso, ela deve manter o botão "All"', () => {
    const { getByText } = renderWithRouter(<App />);

    const botaoAll = getByText('All');
    expect(botaoAll).toBeInTheDocument();
  });
});

describe('7 - O botão de Próximo pokémon deve ser desabilitado se a lista filtrada de pokémons tiver um só pokémon', () => {
  test('botão fica desabilitado se o tipo "Bug" é selecionado', () => {
    const { getByText } = renderWithRouter(<App />);

    const botaoProximoPokemon = getByText('Próximo pokémon');
    expect(botaoProximoPokemon.disabled).toBe(false);

    const botaoBug = getByText('Bug');
    fireEvent.click(botaoBug);

    expect(botaoProximoPokemon.disabled).toBe(true);
  });
});

describe('8 - A Pokedéx deve exibir o nome, tipo, peso médio e imagem do pokémon exibido', () => {
  test('exibe nome e tipo', () => {
    const { getAllByText, getByText } = renderWithRouter(<App />);

    const botaoProximoPokemon = getByText('Próximo pokémon');
    pokemons.forEach((pokemon) => {
      const name = getByText(pokemon.name);
      expect(name).toBeInTheDocument();

      const type = getAllByText(pokemon.type)[0];
      expect(type).toBeInTheDocument();

      fireEvent.click(botaoProximoPokemon);
    });
  });

  test('O peso médio do pokémon deve ser exibido com um texto no formato "Average weight: <value> <measurementUnit>"', () => {
    const { getByText } = renderWithRouter(<App />);

    const botaoProximoPokemon = getByText('Próximo pokémon');
    pokemons.forEach((pokemon) => {
      const averageWeight = getByText(`Average weight: ${pokemon.averageWeight.value} ${pokemon.averageWeight.measurementUnit}`);
      expect(averageWeight).toBeInTheDocument();

      fireEvent.click(botaoProximoPokemon);
    });
  });

  test('A imagem deve conter um atributo src com a URL da imagem do pokémon e um atributo alt com o nome do pokémon', () => {
    const { getByAltText, getByText } = renderWithRouter(<App />);

    const botaoProximoPokemon = getByText('Próximo pokémon');

    pokemons.forEach((pokemon) => {
      const image = getByAltText(`${pokemon.name} sprite`);
      expect(image).toBeInTheDocument();
      expect(image.src).toBe(pokemon.image);

      fireEvent.click(botaoProximoPokemon);
    });
  });
});

describe('9 - O pokémon exibido na Pokedéx deve conter um link de navegação para exibir detalhes deste pokémon', () => {
  test('o link é exibido', () => {
    const { getByText } = renderWithRouter(<App />);

    const botaoProximoPokemon = getByText('Próximo pokémon')

    pokemons.forEach((pokemon) => {
      const linkDetalhes = getByText('More details');
      expect(linkDetalhes).toBeInTheDocument();

      fireEvent.click(botaoProximoPokemon);
    });
  });

  test('O link deve possuir a URL "/pokemons/<id>"', () => {
    const { getByText } = renderWithRouter(<App />);

    const botaoProximoPokemon = getByText('Próximo pokémon')

    pokemons.forEach((pokemon) => {
      const linkDetalhes = getByText('More details');

      expect(linkDetalhes.href).toMatch(`/pokemons/${pokemon.id}`);

      fireEvent.click(botaoProximoPokemon);
    });
  });
});

describe('10 - Ao clicar no link de navegação do pokémon, a aplicação deve ser redirecionada para a página de detalhes de pokémon', () => {
  test('A URL exibida no navegador deve mudar para "/pokemons/<id>"', () => {
    const { history, getByText } = renderWithRouter(<App />);

    expect(history.location.pathname).toBe('/');

    fireEvent.click(getByText('More details'));
    expect(history.location.pathname).toBe(`/pokemons/${pokemons[0].id}`);
  });
});

describe('11 - A página de detalhes de pokémon deve exibir o nome, tipo, peso médio e imagem do pokémon exibido', () => {
  test('exibe nome e tipo', () => {
    const { getByText, history } = renderWithRouter(<App />);

    pokemons.forEach((pokemon, index) => {
      const linkDetalhes = getByText('More details');
      fireEvent.click(linkDetalhes);

      const name = getByText(pokemon.name);
      expect(name).toBeInTheDocument();

      const type = getByText(pokemon.type);
      expect(type).toBeInTheDocument();

      history.push('/');

      const botaoProximoPokemon = getByText('Próximo pokémon');
      for (let i = 0; i <= index; i += 1) {
        fireEvent.click(botaoProximoPokemon);
      }
    });
  });

  test('O peso médio do pokémon deve ser exibido com um texto no formato "Average weight: <value> <measurementUnit>"', () => {
    const { getByText, history } = renderWithRouter(<App />);

    pokemons.forEach((pokemon, index) => {
      const linkDetalhes = getByText('More details');
      fireEvent.click(linkDetalhes);

      const averageWeight = getByText(`Average weight: ${pokemon.averageWeight.value} ${pokemon.averageWeight.measurementUnit}`);
      expect(averageWeight).toBeInTheDocument();

      history.push('/');

      const botaoProximoPokemon = getByText('Próximo pokémon');
      for (let i = 0; i <= index; i += 1) {
        fireEvent.click(botaoProximoPokemon);
      }
    });
  });

  test('A imagem deve conter um atributo src com a URL da imagem do pokémon e um atributo alt com o nome do pokémon', () => {
    const { getByAltText, getByText, history } = renderWithRouter(<App />);

    pokemons.forEach((pokemon, index) => {
      const linkDetalhes = getByText('More details');
      fireEvent.click(linkDetalhes);

      const image = getByAltText(`${pokemon.name} sprite`);
      expect(image).toBeInTheDocument();
      expect(image.src).toBe(pokemon.image);

      history.push('/');

      const botaoProximoPokemon = getByText('Próximo pokémon');
      for (let i = 0; i <= index; i += 1) {
        fireEvent.click(botaoProximoPokemon);
      }
    });
  });
});

describe('12 - O pokémon exibido na página de detalhes não deve conter um link de navegação para exibir detalhes deste pokémon', () => {
  test('não exibe link "More details"', () => {
    const { getByText, history, queryByText } = renderWithRouter(<App />);

    pokemons.forEach((index) => {
      fireEvent.click(getByText('More details'));

      expect(queryByText('More details')).toBeNull();

      history.push('/');

      for (let i = 0; i <= index; i += 1) {
        fireEvent.click(getByText('Próximo pokémon'));
      }
    });
  });
});

describe('13 - A página de detalhes deve exibir uma seção com um resumo do pokémon', () => {
  test('A seção de detalhes deve conter um heading "h2" com o texto "Summary"', () => {
    const { getByText } = renderWithRouter(<App />);

    fireEvent.click(getByText('More details'));

    const summaryH2 = getByText('Summary');
    expect(summaryH2).toBeInTheDocument();
    expect(summaryH2.tagName).toBe('H2');
  });

  test('A seção de detalhes deve conter um parágrafo com o resumo do pokémon específico sendo visualizado', () => {
    const { getByText } = renderWithRouter(<App />);

    fireEvent.click(getByText('More details'));

    const summaryP = getByText(pokemons[0].summary);
    expect(summaryP).toBeInTheDocument();
    expect(summaryP.tagName).toBe('P');
  });
});

describe('14 - A página de detalhes deve exibir uma seção com os mapas com as localizações do pokémon', () => {
  test('A seção de detalhes deve conter um heading "h2" com o texto "Game Locations of <pokémon>"', () => {
    const { getByText } = renderWithRouter(<App />);

    fireEvent.click(getByText('More details'));

    const locationsH2 = getByText(`Game Locations of ${pokemons[0].name}`);
    expect(locationsH2).toBeInTheDocument();
    expect(locationsH2.tagName).toBe('H2');
  });

  test('A seção de detalhes deve exibir todas as localizações do pokémon', () => {
    const { getByText, getAllByTestId } = renderWithRouter(<App />);

    fireEvent.click(getByText('More details'));

    const locationsDIV = getAllByTestId('localizacao');
    expect(locationsDIV.length).toBe(pokemons[0].foundAt.length);
  });

  test('Cada localização deve exibir o nome da localização e uma imagem do mapa da localização', () => {
    const { getByText, getAllByTestId } = renderWithRouter(<App />);

    fireEvent.click(getByText('More details'));

    const locationsDIV = getAllByTestId('localizacao');
    locationsDIV.forEach((location, index) => {
      const localizacaoNome = getByText(pokemons[0].foundAt[index].location);
      expect(localizacaoNome).toBeInTheDocument();

      const localizacaoImagem = getAllByTestId('imagem-localizacao')[index];
      expect(localizacaoImagem).toBeInTheDocument();
    });
  });

  test('A imagem da localização deve ter um atributo "src" com a URL da localização', () => {
    const { getByText, getAllByTestId } = renderWithRouter(<App />);

    fireEvent.click(getByText('More details'));

    const locationsDIV = getAllByTestId('localizacao');
    locationsDIV.forEach((location, index) => {
      const localizacaoImagem = getAllByTestId('imagem-localizacao')[index];
      expect(localizacaoImagem.src).toBe(pokemons[0].foundAt[index].map);
    });
  });

  test('A imagem da localização deve ter um atributo "alt" com o texto "<name> location"', () => {
    const { getByText, getAllByTestId } = renderWithRouter(<App />);

    fireEvent.click(getByText('More details'));

    const locationsDIV = getAllByTestId('localizacao');
    locationsDIV.forEach((location, index) => {
      const localizacaoImagem = getAllByTestId('imagem-localizacao')[index];
      expect(localizacaoImagem.alt).toBe(`${pokemons[0].name} location`);
    });
  });
});

describe('15 - A página de detalhes deve permitir favoritar um pokémon', () => {
  test('A página deve conter um checkbox que permita favoritar um pokémon', () => {
    const { getByText, getByRole } = renderWithRouter(<App />);

    fireEvent.click(getByText('More details'));

    const checkbox = getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();

    expect(checkbox.checked).toBeFalsy();
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBeTruthy();
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBeFalsy();
  });

  test('O label do checkbox deve ser "Pokémon favoritado?"', () => {
    const { getByText, getByRole } = renderWithRouter(<App />);

    fireEvent.click(getByText('More details'));

    const checkbox = getByRole('checkbox');
    expect(checkbox.parentNode.tagName).toBe('LABEL');
    expect(checkbox.parentNode.innerHTML).toMatch('Pokémon favoritado?');
  });
});

describe('16 - Pokémons favoritados devem exibir um ícone de uma estrela', () => {
  test('O ícone deve ser uma imagem, com o atributo "src" igual "/star-icon.svg"', () => {
    const { getByText, getByRole, getAllByRole } = renderWithRouter(<App />);

    fireEvent.click(getByText('More details'));

    const checkbox = getByRole('checkbox');

    let arrayImagens = getAllByRole('img');
    let imagemEstrela = arrayImagens.find((imagem) => imagem.src === "http://localhost/star-icon.svg");
    expect(imagemEstrela).not.toBeDefined();

    fireEvent.click(checkbox);
    arrayImagens = getAllByRole('img');
    imagemEstrela = arrayImagens.find((imagem) => imagem.src === "http://localhost/star-icon.svg");
    expect(imagemEstrela).toBeInTheDocument();

    fireEvent.click(checkbox);
    arrayImagens = getAllByRole('img');
    imagemEstrela = arrayImagens.find((imagem) => imagem.src === "http://localhost/star-icon.svg");
    expect(imagemEstrela).not.toBeDefined();
  });

  test('A imagem deve ter o atributo "alt" igual a "<pokemon> is marked as favorite"', () => {
    const { getByText, getByRole, getAllByRole } = renderWithRouter(<App />);

    fireEvent.click(getByText('More details'));

    const checkbox = getByRole('checkbox');
    fireEvent.click(checkbox);

    const arrayImagens = getAllByRole('img');
    const imagemEstrela = arrayImagens.find((imagem) => imagem.src === "http://localhost/star-icon.svg");

    expect(imagemEstrela.alt).toBe(`${pokemons[0].name} is marked as favorite`);
  });
});

describe('17 - No topo da aplicação, deve haver um conjunto fixo de links de navegação', () => {
  test('O primeiro link deve possuir o texto "Home" com a URL "/"', () => {
    const { getByRole } = renderWithRouter(<App />);

    const navegacao = getByRole('navigation');
    expect(navegacao).toBeInTheDocument();

    const home = getByRole('navigation').firstChild;
    expect(home).toBeInTheDocument();
    expect(home.innerHTML).toBe('Home');
    expect(home.href).toBe('http://localhost/');
  });

  test('O segundo link deve possuir o texto "About" com a URL "/about"', () => {
    const { getByRole } = renderWithRouter(<App />);

    const about = getByRole('navigation').firstChild.nextSibling;
    expect(about).toBeInTheDocument();
    expect(about.innerHTML).toBe('About');
    expect(about.href).toBe('http://localhost/about');
  });

  test('O terceiro link deve possuir o texto "Favorite Pokémons" com a URL "/favorites"', () => {
    const { getByRole } = renderWithRouter(<App />);

    const favoritePokemons = getByRole('navigation').lastChild;
    expect(favoritePokemons).toBeInTheDocument();
    expect(favoritePokemons.innerHTML).toBe('Favorite Pokémons');
    expect(favoritePokemons.href).toBe('http://localhost/favorites');
  });
});

describe('18 - Ao clicar no link "Home" na barra de navegação, a aplicação deve ser redirecionada para a página inicial, na URL "/"', () => {
  test('a partir da página inicial, redireciona para a própria página inicial', () => {
    const { history, getByText } = renderWithRouter(<App />);

    expect(history.location.pathname).toBe('/');

    fireEvent.click(getByText('Home'));
    expect(history.location.pathname).toBe('/');
  });

  test('a partir da página de detalhes do primeiro pokemon, redireciona para a página inicial', () => {
    const { history, getByText } = renderWithRouter(<App />);

    fireEvent.click(getByText('More details'));
    expect(history.location.pathname).toBe(`/pokemons/${pokemons[0].id}`);

    fireEvent.click(getByText('Home'));
    expect(history.location.pathname).toBe('/');
  });
});

describe('19 - Ao clicar no link "About" na barra de navegação, a aplicação deve ser redirecionada para a página de About, na URL "/about"', () => {
  test('a partir da página inicial, redireciona para a página de About', () => {
    const { history, getByText } = renderWithRouter(<App />);

    expect(history.location.pathname).toBe('/');

    fireEvent.click(getByText('About'));
    expect(history.location.pathname).toBe('/about');
  });

  test('a partir da página de detalhes do primeiro pokemon, redireciona para a página de About', () => {
    const { history, getByText } = renderWithRouter(<App />);

    fireEvent.click(getByText('More details'));
    expect(history.location.pathname).toBe(`/pokemons/${pokemons[0].id}`);

    fireEvent.click(getByText('About'));
    expect(history.location.pathname).toBe('/about');
  });
});

describe('20 - Ao clicar no link "Favorite Pokémons" na barra de navegação, a aplicação deve ser redirecionada para a página de pokémons favoritados, na URL "/favorites"', () => {
  test('a partir da página inicial, redireciona para a página de pokémons favoritados', () => {
    const { history, getByText } = renderWithRouter(<App />);

    expect(history.location.pathname).toBe('/');

    fireEvent.click(getByText('Favorite Pokémons'));
    expect(history.location.pathname).toBe('/favorites');
  });

  test('a partir da página de detalhes do primeiro pokemon, redireciona para a página de pokémons favoritados', () => {
    const { history, getByText } = renderWithRouter(<App />);

    fireEvent.click(getByText('More details'));
    expect(history.location.pathname).toBe(`/pokemons/${pokemons[0].id}`);

    fireEvent.click(getByText('Favorite Pokémons'));
    expect(history.location.pathname).toBe('/favorites');
  });
});

describe('21 - A página "About" deve exibir informações sobre a Pokédex', () => {
  test('A página deve conter um heading "h2" com o texto "About Pokédex"', () => {
    const { getByText } = renderWithRouter(<App />);

    fireEvent.click(getByText('About'));

    const headingH2 = getByText('About Pokédex');
    expect(headingH2).toBeInTheDocument();
    expect(headingH2.tagName).toBe('H2');
  });

  test('A página deve conter dois parágrafos com texto sobre a Pokédex', () => {
    const { getByText, getAllByTestId } = renderWithRouter(<App />);

    fireEvent.click(getByText('About'));

    expect(document.getElementsByTagName('p').length).toBe(2);

    const paragrafosDescricao = getAllByTestId('paragrafo-descricao');
    paragrafosDescricao.forEach((paragrafo) => {
      expect(paragrafo).toBeInTheDocument();
    });
  });

  test('A página deve conter a seguinte imagem de uma Pokédex: "https://cdn.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png"', () => {
    const { getByText, getByRole } = renderWithRouter(<App />);

    fireEvent.click(getByText('About'));

    const imagemPokedex = getByRole('img');
    expect(imagemPokedex).toBeInTheDocument();
    expect(imagemPokedex.src).toBe('https://cdn.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png');
  });
});

describe('22 - A página de pokémon favoritos deve exibir os pokémons favoritos', () => {
  test('simulação com lista vazia de pokémons favoritados', () => {
    const favoritos = [];

    const { queryByText, getByText } = renderWithRouter(<FavoritePokemons pokemons={favoritos} />);

    pokemons.forEach(pokemon => {
      expect(queryByText(pokemon.name)).toBeNull();
    });

    expect(getByText('No favorite pokemon found')).toBeInTheDocument();
  });

  test('simulação com lista de pokémons cujo id é maior que 50', () => {
    const favoritos = pokemons.filter((pokemon) => pokemon.id > 50);
    const { getByText, queryByText } = renderWithRouter(<FavoritePokemons pokemons={favoritos} />);

    favoritos.forEach((pokemon) => {
      expect(getByText(pokemon.name)).toBeInTheDocument();
    });

    const naoFavoritos = pokemons.filter(pokemon => pokemon.id <= 50);
    naoFavoritos.forEach(pokemon => {
      expect(queryByText(pokemon.name)).toBeNull();
    });

    expect(queryByText('No favorite pokemon found')).toBeNull();
  });
});

describe('23 - Entrar em uma URL desconhecida exibe a página "Not Found"', () => {
  test('A página deve conter um heading "h2" com o texto "Page requested not found 😭"', () => {
    const { getByText } = renderWithRouter(
      <App />,
      { route: '/aaaaa' }
    );

    const headingH2 = getByText(/Page requested not found/);
    expect(headingH2).toBeInTheDocument();
    expect(headingH2.tagName).toBe('H2');
  });

  test('A página deve exibir a imagem "https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif"', () => {
    const { getAllByRole } = renderWithRouter(
      <App />,
      { route: '/aaaaa' }
    );

    const imagemGif = getAllByRole('img')[1];
    expect(imagemGif).toBeInTheDocument();
    expect(imagemGif.src).toBe('https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif');
  });
});
