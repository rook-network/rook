import { render } from '@testing-library/react';

import Game from '.';

describe('Game', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Game />);
    expect(baseElement).toBeTruthy();
  });
});
