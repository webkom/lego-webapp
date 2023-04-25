import { Meeting } from '../../actions/ActionTypes';
import meetingsToken from '../meetingsToken';

describe('reducers', () => {
  const prevState = {
    response: 'abc',
    user: {},
    meeting: null,
    status: '',
  };
  describe('meetingsToken', () => {
    it('Meeting.ANSWER_INVITATION_TOKEN.FAILURE', () => {
      const action = {
        type: Meeting.ANSWER_INVITATION_TOKEN.FAILURE,
      };
      expect(meetingsToken(prevState, action)).toEqual({
        response: 'abc',
        user: {},
        meeting: null,
        status: 'FAILURE',
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
        response: '',
        user: {},
        meeting: null,
        status: '',
      });
    });
  });
});
