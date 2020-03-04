import React from 'react';

class Locations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      offset: 20,
      controle: 0,
    };
    this.nextButton = this.nextButton.bind(this);
    this.previousButton = this.previousButton.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    fetch('https://pokeapi.co/api/v2/ability/?offset=20&limit=20')
      .then((resolve) => resolve.json())
      .then(({ results, count }) => this.setState({
        results: results.filter(({ name }) => name),
        controle: count,
      }));
  }

  nextButton() {
    const { offset } = this.state;
    fetch(`https://pokeapi.co/api/v2/ability/?offset=${offset + 20}&limit=20`)
      .then((resolve) => resolve.json())
      .then(({ results }) => this.setState((state) => ({
        results: results.filter(({ name }) => name), offset: state.offset + 20,
      })));
  }

  previousButton() {
    const { offset } = this.state;
    fetch(`https://pokeapi.co/api/v2/ability/?offset=${offset - 20}&limit=20`)
      .then((resolve) => resolve.json())
      .then(({ results }) => this.setState((state) => ({
        results: results.filter(({ name }) => name), offset: state.offset - 20,
      })));
  }

  render() {
    const { results, offset, controle } = this.state;
    return (
      <div>
        <button
          disabled={(offset === 20) ? !false : false}
          onClick={this.previousButton}
          type="button"
        >
          Previous Page
        </button>
        <button
          disabled={(offset >= controle - 20) ? !false : false}
          onClick={this.nextButton}
          type="button"
        >
          Next Page
        </button>
        {results.map(({ name }) => (
          <div key={name}>
            <h2>{name}</h2>
          </div>
        ))}
      </div>
    );
  }
}


export default Locations;
