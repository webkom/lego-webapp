import { describe, it, expect } from 'vitest';
import { Readme } from '../../actions/ActionTypes';
import readme from '../readme';

describe('reducers', () => {
  describe('readme', () => {
    const prevState = undefined;
    it('Readme should populate default state correctly', () => {
      const randomAction = {};
      expect(readme(prevState, randomAction)).toEqual([]);
    });
    it('Readme should populate state correctly after fetch', () => {
      const action = {
        type: Readme.FETCH.SUCCESS,
        payload: [1, 2, 3],
      };
      expect(readme(prevState, action)).toEqual([1, 2, 3]);
    });
  });
});
