import { describe, it, expect } from 'vitest';
import { Meeting } from 'app/actions/ActionTypes';
import { MeetingInvitationStatus } from 'app/store/models/MeetingInvitation';
import meetingInvitations from '../meetingInvitations';

describe('reducers', () => {
  describe('meetingInvitations', () => {
    it('Meeting.SET_INVITATION_STATUS.SUCCESS', () => {
      const prevState: ReturnType<typeof meetingInvitations> = {
        actionGrant: [],
        paginationNext: {},
        fetching: false,
        ids: ['3-42'],
        entities: {
          '3-42': {
            meeting: 3,
            user: 42,
            status: MeetingInvitationStatus.NoAnswer,
          },
        },
      };
      const action = {
        type: Meeting.SET_INVITATION_STATUS.SUCCESS,
        meta: {
          meetingId: 3,
          status: MeetingInvitationStatus.Attending,
          user: {
            id: 42,
            username: 'test',
          },
        },
      };
      expect(meetingInvitations(prevState, action)).toEqual({
        ...prevState,
        ids: ['3-42'],
        entities: {
          '3-42': {
            meeting: 3,
            user: 42,
            status: MeetingInvitationStatus.Attending,
          },
        },
      });
    });
  });
});
