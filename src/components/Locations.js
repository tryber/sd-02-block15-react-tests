import React from 'react';
import { render } from 'react-dom';

class Locations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      previous: '',
      next: '',
    };
    // this.nextButton = this.nextButton.bind(this);
    // this.previousButton = this.previousButton.bind(this);
  }

  async componentDidMount() {
    const response = await fetch('https://pokeapi.co/api/v2/location');
    const json = await response.json();
    const { results, previous, next } = json;
    console.log(results);
    this.setState({ results, previous, next });
  }

  render() {
    const { results, previous, next } = this.state;
    if (results.length > 1) {
      return (
        <div>
          <ul>
            {results.map(({ name }) => (
              <li>
                {name}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return (
      <h2>Carregando...</h2>
    );
  }
}

export default Locations;
