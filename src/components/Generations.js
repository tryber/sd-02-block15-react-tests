import React from 'react';
import { Link } from 'react-router-dom';

class Generations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrResults: [],
    };
  }

  componentDidMount() {
    fetch('https://pokeapi.co/api/v2/generation')
      .then((resolve) => resolve.json())
      .then(({ results }) => this.setState({ arrResults: results }));
  }

  render() {
    const { arrResults } = this.state;
    console.log(arrResults);
    return (
      <div>
        {arrResults.map(({ name, url }, index) => (
          <div key={name}>
            <Link 
            to={{
              pathname: `/generations/${index + 1}`,
              state: {
                url,
              },
            }}
            >
              {name}
            </Link>
          </div>
        ))}
      </div>
    );
  }
}

export default Generations;
