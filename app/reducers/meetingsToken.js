// @flow

import { Meeting } from '../actions/ActionTypes';
import { produce } from 'immer';

const initialState = {
  response: '',
  user: {},
  meeting: null,
  status: '',
};

type State = typeof initialState;

const meetingsToken = produce<State>(
  (newState: State, action: any): void | State => {
    switch (action.type) {
      case Meeting.ANSWER_INVITATION_TOKEN.FAILURE:
        newState.status = 'FAILURE';
        break;

      case Meeting.ANSWER_INVITATION_TOKEN.SUCCESS: {
        const { meeting, user, status } = action.payload;

        return {
          response: 'SUCCESS',
          user,
          meeting,
          status,
        };
      }

      case Meeting.RESET_MEETINGS_TOKEN: {
        return initialState;
      }
      default:
        break;
    }
  },
  initialState
);

export default meetingsToken;
