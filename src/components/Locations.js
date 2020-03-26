import React from 'react';

class Locations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      previousPage: '',
      nextPage: '',
    };
    this.nextButton = this.nextButton.bind(this);
    this.previousButton = this.previousButton.bind(this);
  }

  async componentDidMount() {
    const response = await fetch('https://pokeapi.co/api/v2/location');
    const json = await response.json();
    const { results, previous, next } = json;
    this.setState({ results, previousPage: previous, nextPage: next });
  }

  async nextButton() {
    const { nextPage } = this.state;
    const response = await fetch(nextPage);
    const json = await response.json();
    const { results, previous, next } = json;
    this.setState({ results, previousPage: previous, nextPage: next });
  }

  async previousButton() {
    const { previousPage } = this.state;
    const response = await fetch(previousPage);
    const json = await response.json();
    const { results, previous, next } = json;
    this.setState({ results, previousPage: previous, nextPage: next });
  }

  render() {
    const { results, previous, next } = this.state;
    if (results.length > 1) {
      return (
        <div>
          <div>
            <div>
              <button type="button" disabled={previous === null} onClick={this.previousButton}>
                Previous locations
              </button>
            </div>
            <div>
              <button type="button" disabled={next === null} onClick={this.nextButton}>
                Next locations
              </button>
            </div>
          </div>
          <div>
            {results.map(({ name }) => (
              <h2>
                {name}
              </h2>
            ))}
          </div>
        </div>
      );
    }
    return (
      <h2> Carregando...</h2>
    );
  }
}

export default Locations;
