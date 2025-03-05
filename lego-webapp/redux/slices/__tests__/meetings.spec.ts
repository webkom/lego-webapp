import { describe, it, expect } from 'vitest';
import { Meeting } from '~/redux/actionTypes';
import meetings, {
  MeetingTokenResponse,
  resetMeetingToken,
} from '~/redux/slices/meetings';

describe('reducers', () => {
  const baseState: ReturnType<typeof meetings> = {
    actionGrant: [],
    paginationNext: {},
    fetching: false,
    ids: [],
    entities: {},
    meetingToken: {},
  };
  describe('meetingToken', () => {
    it('Meeting.ANSWER_INVITATION_TOKEN.FAILURE', () => {
      const action = {
        type: Meeting.ANSWER_INVITATION_TOKEN.FAILURE,
      };
      expect(meetings(baseState, action)).toEqual({
        ...baseState,
        meetingToken: { response: MeetingTokenResponse.Failure },
      });
    });
    it('Meeting.ANSWER_INVITATION_TOKEN.SUCCESS', () => {
      const action = {
        type: Meeting.ANSWER_INVITATION_TOKEN.SUCCESS,
        payload: {
          meeting: 123,
          user: 123,
          status: 'xyz',
        },
      };
      expect(meetings(baseState, action)).toEqual({
        ...baseState,
        meetingToken: {
          response: 'SUCCESS',
          user: 123,
          meeting: 123,
          status: 'xyz',
        },
      });
    });
    it('Meeting.RESET_MEETINGS_TOKEN', () => {
      const action = resetMeetingToken();
      expect(
        meetings(
          {
            ...baseState,
            meetingToken: { response: MeetingTokenResponse.Failure },
          },
          action,
        ),
      ).toEqual(baseState);
    });
  });
});
