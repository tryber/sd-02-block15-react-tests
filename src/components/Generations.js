import React from 'react';
import { Link } from 'react-router-dom';

class Generations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
    };
  }

  async componentDidMount() {
    const response = await fetch('https://pokeapi.co/api/v2/generation');
    const json = await response.json();
    const { results } = json;
    this.setState({ results });
  }

  renderPokemonDetails(match) {
    const { isPokemonFavoriteById } = this.state;

    return (
      <PokemonDetails
        isPokemonFavoriteById={isPokemonFavoriteById}
        match={match}
        pokemons={pokemons}
        onUpdateFavoritePokemons={(pokemonId, isFavorite) => (
          this.onUpdateFavoritePokemons(pokemonId, isFavorite)
        )}
      />
    );
  }

  render() {
    const { results } = this.state;
    if (results.length > 1) {
      return (
        <div>
          <div>
            <ol>
              {results.map(({ name, url }, index) => (
                <li>
                  <Link
                    className="link"
                    to={`/generations/${index}`}
                    onClick={this.renderPokemonDetails({ url })}
                  >
                    {name}
                  </Link>
                  {url}
                </li>
              ))}
            </ol>
          </div>
        </div>
      );
    }
    return (
      <h2> Carregando...</h2>
    );
  }
}

export default Generations;
