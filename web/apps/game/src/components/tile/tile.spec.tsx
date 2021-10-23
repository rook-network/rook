import { render } from '@testing-library/react';

import Tile from '.';

describe('Tile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Tile />);
    expect(baseElement).toBeTruthy();
  });
});
