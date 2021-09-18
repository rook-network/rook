import { render } from '@testing-library/react';

import Map from './map';

describe('Map', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Map />);
    expect(baseElement).toBeTruthy();
  });
});
