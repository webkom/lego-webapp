import { produce } from 'immer';
import type { ID } from 'app/store/models';
import type { MeetingInvitationStatus } from 'app/store/models/MeetingInvitation';
import type { PublicUser } from 'app/store/models/User';
import { Meeting } from '../actions/ActionTypes';
import type { Reducer } from '@reduxjs/toolkit';

export type MeetingsTokenResponse = 'SUCCESS' | 'FAILURE';

type State = {
  response?: MeetingsTokenResponse;
  user?: PublicUser;
  meeting?: ID;
  status?: MeetingInvitationStatus;
};

const initialState: State = {
  response: undefined,
  user: undefined,
  meeting: undefined,
  status: undefined,
};

const meetingsToken: Reducer<State> = produce((newState, action) => {
  switch (action.type) {
    case Meeting.ANSWER_INVITATION_TOKEN.FAILURE:
      newState.response = 'FAILURE';
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
