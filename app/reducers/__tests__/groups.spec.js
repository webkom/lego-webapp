import groups from '../groups';
import { Group, Membership } from '../../actions/ActionTypes';

describe('reducers', () => {
  const baseState = {
    actionGrant: [],
    pagination: {},
    items: [1],
    byId: {
      1: {
        memberships: [3],
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
        items: [1],
        byId: {
          1: {
            memberships: [3, 4],
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
        items: [1],
        byId: {
          1: {
            memberships: [],
          },
        },
      });
    });
    it('Group.MEMBERSHIP_FETCH.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Group.MEMBERSHIP_FETCH.SUCCESS,
        meta: {
          groupId: 1,
        },
        payload: {
          result: [4, 5, 6],
        },
      };
      expect(groups(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [1],
        byId: {
          1: {
            memberships: [3, 4, 5, 6],
          },
        },
      });
    });
  });
});
