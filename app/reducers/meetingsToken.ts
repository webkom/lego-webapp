import { produce } from 'immer';
import { Meeting } from '../actions/ActionTypes';
import type { Reducer } from '@reduxjs/toolkit';

const initialState = {
  response: '',
  user: {},
  meeting: null,
  status: '',
};
type State = typeof initialState;
const meetingsToken: Reducer<State> = produce((newState, action) => {
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
}, initialState);
export default meetingsToken;
