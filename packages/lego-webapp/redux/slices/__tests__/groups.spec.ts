import { describe, it, expect } from 'vitest';
import { Membership } from '~/redux/actionTypes';
import groups from '../groups';
import type { DetailedGroup } from '~/redux/models/Group';

describe('reducers', () => {
  const baseState: ReturnType<typeof groups> = {
    actionGrant: [],
    paginationNext: {},
    fetching: false,
    ids: [1],
    entities: {
      1: {
        numberOfUsers: 1,
      } as DetailedGroup,
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
        ...baseState,
        ids: [1],
        entities: {
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
        ...baseState,
        ids: [1],
        entities: {
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
        ...baseState,
        ids: [1],
        entities: {
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
        ...baseState,
        ids: [1],
        entities: {
          1: {
            numberOfUsers: 1,
          },
        },
      });
    });
  });
});
