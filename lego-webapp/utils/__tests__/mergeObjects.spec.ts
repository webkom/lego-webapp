import { describe, it, expect } from 'vitest';
import mergeObjects from '../mergeObjects';

describe('mergeObjects', () => {
  it('should merge objects deeply', () => {
    const first = {
      a: {
        one: 1,
      },
    };
    const second = {
      a: {
        two: 2,
      },
    };
    expect(mergeObjects(first, second)).toEqual({
      a: {
        one: 1,
        two: 2,
      },
    });
  });
  it('should override old arrays', () => {
    const first = {
      a: {
        one: [1, 2, 3],
      },
    };
    const second = {
      a: {
        one: [1, 2],
      },
    };
    expect(mergeObjects(first, second)).toEqual({
      a: {
        one: [1, 2],
      },
    });
  });
});
