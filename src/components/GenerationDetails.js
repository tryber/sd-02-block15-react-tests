import React from 'react';

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
    return (
      <div>
        {results.map(({ name }) => <div key={name}><h3>{name}</h3></div>)}
      </div>
    );
  }
}
export default GenerationInfo;

