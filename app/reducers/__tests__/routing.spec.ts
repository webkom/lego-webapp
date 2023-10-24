import { describe, it, expect } from 'vitest';
import { Routing } from '../../actions/ActionTypes';
import routing from '../routing';

describe('reducers', () => {
  describe('routing', () => {
    const prevState = undefined;
    it('Routing should populate default state correctly', () => {
      const randomAction = {};
      expect(routing(prevState, randomAction)).toEqual({
        statusCode: null,
      });
    });
    it('Routing should populate state correctly after SET_STATUS_CODE', () => {
      const action = {
        type: Routing.SET_STATUS_CODE,
        payload: 400,
      };
      expect(routing(prevState, action)).toEqual({
        statusCode: 400,
      });
    });
  });
});
