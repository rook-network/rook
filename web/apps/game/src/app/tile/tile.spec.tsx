import { render } from '@testing-library/react';

import Tile from './tile';

describe('Tile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Tile />);
    expect(baseElement).toBeTruthy();
  });
});
