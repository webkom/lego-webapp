import { describe, it, expect } from 'vitest';
import { Meeting } from '../../actions/ActionTypes';
import meetingsToken from '../meetingsToken';

describe('reducers', () => {
  const prevState = {
    response: undefined,
    user: undefined,
    meeting: undefined,
    status: undefined,
  };
  describe('meetingsToken', () => {
    it('Meeting.ANSWER_INVITATION_TOKEN.FAILURE', () => {
      const action = {
        type: Meeting.ANSWER_INVITATION_TOKEN.FAILURE,
      };
      expect(meetingsToken(prevState, action)).toEqual({
        response: 'FAILURE',
        user: undefined,
        meeting: undefined,
        status: undefined,
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
      expect(meetingsToken(prevState, action)).toEqual({
        response: 'SUCCESS',
        user: 123,
        meeting: 123,
        status: 'xyz',
      });
    });
    it('Meeting.RESET_MEETINGS_TOKEN', () => {
      const action = {
        type: Meeting.RESET_MEETINGS_TOKEN,
      };
      expect(meetingsToken(prevState, action)).toEqual({
        response: undefined,
        user: undefined,
        meeting: undefined,
        status: undefined,
      });
    });
  });
});
