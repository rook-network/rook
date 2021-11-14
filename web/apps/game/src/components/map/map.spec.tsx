import { render } from '@testing-library/react';

import Map, { createGrid, shift, shiftColumns, shiftRows, serialize } from '.';

describe('Map', () => {
  it ("should generate a test grid", () => {
    expect(createGrid(3, 3)).toStrictEqual([[0, 1, 2], [3, 4, 5], [6, 7, 8]])
  })

  it('should be able to shift columns', () => {
    expect(shiftColumns(createGrid(3, 3), 1)).toStrictEqual([[2, 0, 1], [5, 3, 4], [8, 6, 7]])
  });

  it('should be able to shift rows', () => {
    expect(shiftRows(createGrid(3, 3), 1)).toStrictEqual([[6, 7, 8], [0, 1, 2], [3, 4, 5]])
  })

  it('should be able to shift the entire grid', () => {
    expect(shift(createGrid(3, 3), { x: 1, y: 2 })).toStrictEqual([[5, 3, 4], [8, 6, 7], [2, 0, 1]])
  })

  it('can serialize a grid', () => {
    expect(serialize(createGrid(3, 3))).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
  })
});


