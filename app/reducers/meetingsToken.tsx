

import { Meeting } from '../actions/ActionTypes';

const initialState = {
  response: '',
  user: {},
  meeting: null,
  status: ''
};

type State = typeof initialState;

export default function meetingsToken(
  state: State = initialState,
  action: any
) {
  switch (action.type) {
    case Meeting.ANSWER_INVITATION_TOKEN.FAILURE: {
      return { ...initialState, status: 'FAILURE' };
    }
    case Meeting.ANSWER_INVITATION_TOKEN.SUCCESS: {
      const { meeting, user, status } = action.payload;

      return {
        response: 'SUCCESS',
        user,
        meeting,
        status
      };
    }
    case Meeting.RESET_MEETINGS_TOKEN: {
      return initialState;
    }
    default:
      return state;
  }
}
