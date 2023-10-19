import { describe, it, expect } from 'vitest';
import { Meeting } from '../../actions/ActionTypes';
import meetingInvitations from '../meetingInvitations';

describe('reducers', () => {
  describe('meetingInvitations', () => {
    it('Meeting.SET_INVITATION_STATUS.SUCCESS', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: ['3-test'],
        byId: {
          '3-test': {
            status: 'nope',
          },
        },
      };
      const action = {
        type: Meeting.SET_INVITATION_STATUS.SUCCESS,
        meta: {
          meetingId: 3,
          status: 'ok',
          user: {
            username: 'test',
          },
        },
      };
      expect(meetingInvitations(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: ['3-test'],
        byId: {
          '3-test': {
            status: 'ok',
          },
        },
      });
    });
  });
});
