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

  render() {
    const { results } = this.state;
    if (results.length > 1) {
      return (
        <div>
          <div>
            <ol>
              {results.map(({ name, url }, index) => (
                <li key={name}>
                  <Link
                    className="link"
                    to={{
                      pathname: `/generations/${index + 1}`,
                      state: {
                        url,
                      },
                    }}
                  >
                    {name}
                  </Link>
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
