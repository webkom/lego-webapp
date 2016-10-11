// @flow

import createEntityReducer from 'app/utils/createEntityReducer';
import { MeetingInvitations } from '../actions/ActionTypes';
import { createSelector } from 'reselect';

/**
 * Used by the individual entity reducers
 */
export default createEntityReducer({
  key: 'meetingInvitations',
  types: {
    fetch: MeetingInvitations.FETCH
  }
});

export const selectMeetingInvitations = createSelector(
  (state) => state.meetingInvitations.byId,
  (state) => state.meetingInvitations.items,
  (meetingInvitationsById, meetingInvitationIds) =>
    meetingInvitationIds.map((id) => meetingInvitationsById[id])
);

export const selectMeetingInvitationsById = createSelector(
  (state) => state.meetingInvitations.byId,
  (state, props) => props.meetingInvitationId,
  (meetingInvitationsById, meetingInvitationId) => meetingInvitationsById[meetingInvitationId]
);
