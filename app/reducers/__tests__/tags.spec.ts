import { describe, it, expect } from 'vitest';
import { Tag } from '../../actions/ActionTypes';
import tags from '../tags';

describe('reducers', () => {
  describe('tags', () => {
    const baseState = {
      actionGrant: [],
      pagination: {},
      items: [],
      byId: {},
    };
    it('Fetching popular tags populates state', () => {
      const prevState = baseState;
      const action = {
        type: Tag.POPULAR.SUCCESS,
        payload: [1, 2, 3],
      };
      expect(tags(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [],
        byId: {},
        popular: [1, 2, 3],
      });
    });
  });
});
