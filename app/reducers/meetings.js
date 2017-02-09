// @flow

import { Meeting } from '../actions/ActionTypes';
import { createSelector } from 'reselect';
import createEntityReducer from 'app/utils/createEntityReducer';

export default createEntityReducer({
  key: 'meetings',
  types: {
    fetch: Meeting.FETCH
  },
  mutate(state, action) {
    switch (action.type) {
      case Meeting.SET_INVITATION_STATUS.SUCCESS: {
        const { meetingId, status, user } = action.meta;
        return {
          ...state,
          byId: {
            ...state.byId,
            [meetingId]: {
              ...state.byId[meetingId],
              invitations: state.byId[meetingId].invitations.map(
                (invitation) => {
                  if (invitation.user.id === user) {
                    invitation.status = status;
                  }
                  return invitation;
                })
            }
          }
        };
      }
      default:
        return state;
    }
  }
});

export const selectMeetings = createSelector(
  (state) => state.meetings.byId,
  (state) => state.meetings.items,
  (meetingsById, meetingIds) => meetingIds.map((id) => meetingsById[id])
);

export const selectMeetingById = createSelector(
  (state) => state.meetings.byId,
  (state, props) => props.meetingId,
  (meetingsById, meetingId) => meetingsById[meetingId]
);

