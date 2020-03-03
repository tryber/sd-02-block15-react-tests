import React from 'react';
import PropTypes from 'prop-types';

class GenerationInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
    };
  }

  componentDidMount() {
    const { location: { state: { url } } } = this.props;
    fetch(url)
      .then((resolve) => resolve.json())
      .then(({ pokemon_species: pokemonSpecies }) => this.setState({ results: pokemonSpecies }));
  }

  render() {
    const { results } = this.state;
    console.log(results)
    return (
      <div>
        {results.map(({ name }) => <div key={name}><h3>{name}</h3></div>)}
      </div>
    );
  }
}
export default GenerationInfo;

GenerationInfo.propTypes = PropTypes.shape({
  location: PropTypes.shape({
    state: PropTypes.shape({
      url: PropTypes.array,
    }),
  }),
}).isRequired;
