import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import About from './About';

describe('Page About', () => {
  test('About render', () => {
    const { getByText, getByTestId } = render(
      <About />,
    );
    const about = getByTestId('page-about');
    expect(about).toBeInTheDocument();
    expect(getByText(/About Pokédex/i)).toBeInTheDocument();
    const ps = about.querySelectorAll('p');
    expect(ps).toHaveLength(2);

    const img = about.querySelector('img');
    expect(img.getAttribute('src'))
      .toBe('https://cdn.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png');
  });
});
