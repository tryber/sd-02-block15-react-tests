import React from 'react';
import PropTypes from 'prop-types';

class GenerationInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      generation: '',
    };
  }

  async componentDidMount() {
    const { location: { state: { url } } } = this.props;
    const response = await fetch(url);
    const json = await response.json();
    const { pokemon_species: pokemonSpecies, name } = json;
    this.setState({ generation: name, results: pokemonSpecies });
  }

  render() {
    const { results, generation } = this.state;
    return (
      <div>
        <h1>
          {`Pokémons of ${generation}`}
        </h1>
        <div>
          <div>
            {results.map(({ name }) => <div key={name}><h3>{name}</h3></div>)}
          </div>
        </div>
      </div>
    );
  }
}

GenerationInfo.propTypes = PropTypes.shape({
  location: PropTypes.shape({
    state: PropTypes.shape({
      url: PropTypes.array,
    }),
  }),
}).isRequired;

export default GenerationInfo;
