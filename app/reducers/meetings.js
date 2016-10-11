// @flow

import { Meeting } from '../actions/ActionTypes';
import { createSelector } from 'reselect';
import createEntityReducer from 'app/utils/createEntityReducer';

export default createEntityReducer({
  key: 'meetings',
  types: {
    fetch: Meeting.FETCH
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

