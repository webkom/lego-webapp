import { describe, it, expect } from 'vitest';
import { fetchReadmes } from 'app/actions/FrontpageActions';
import readme from '../readme';
import type { Readme } from 'app/models';

describe('reducers', () => {
  describe('readme', () => {
    const prevState = undefined;
    it('Readme should populate default state correctly', () => {
      const randomAction = {
        type: 'random',
      };
      expect(readme(prevState, randomAction)).toEqual([]);
    });
    it('Readme should populate state correctly after fetch', () => {
      const action = fetchReadmes.fulfilled(
        [1, 2, 3] as unknown as Readme[],
        'test',
        2,
      );
      expect(readme(prevState, action)).toEqual([1, 2, 3]);
    });
  });
});
