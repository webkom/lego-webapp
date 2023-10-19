import { describe, it, expect } from 'vitest';
import { Membership } from '../../actions/ActionTypes';
import groups from '../groups';

describe('reducers', () => {
  const baseState = {
    actionGrant: [],
    pagination: {},
    paginationNext: {},
    items: [1],
    byId: {
      1: {
        numberOfUsers: 1,
      },
    },
  };
  describe('groups', () => {
    it('Membership.CREATE.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Membership.CREATE.SUCCESS,
        meta: {
          groupId: 1,
        },
        payload: {
          result: 4,
        },
      };
      expect(groups(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        paginationNext: {},
        items: [1],
        byId: {
          1: {
            numberOfUsers: 2,
          },
        },
      });
    });
    it('Membership.REMOVE.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Membership.REMOVE.SUCCESS,
        meta: {
          groupId: 1,
          id: 3,
        },
      };
      expect(groups(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        paginationNext: {},
        items: [1],
        byId: {
          1: {
            numberOfUsers: 0,
          },
        },
      });
    });
    it('Membership.CREATE.SUCCESS group missing', () => {
      const prevState = baseState;
      const action = {
        type: Membership.CREATE.SUCCESS,
        meta: {
          groupId: 2,
        },
        payload: {
          result: 4,
        },
      };
      expect(groups(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        paginationNext: {},
        items: [1],
        byId: {
          1: {
            numberOfUsers: 1,
          },
        },
      });
    });
    it('Membership.REMOVE.SUCCESS group missing', () => {
      const prevState = baseState;
      const action = {
        type: Membership.REMOVE.SUCCESS,
        meta: {
          groupId: 2,
          id: 3,
        },
      };
      expect(groups(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        paginationNext: {},
        items: [1],
        byId: {
          1: {
            numberOfUsers: 1,
          },
        },
      });
    });
  });
});
