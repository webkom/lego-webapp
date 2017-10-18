// @flow

import { Meeting } from '../actions/ActionTypes';
import { createSelector } from 'reselect';
import createEntityReducer from 'app/utils/createEntityReducer';
import type Moment from 'moment';

export type MeetingEntity = {
  id: number,
  title: string,
  location: string,
  startTime: Moment,
  endTime: Moment,
  report: string,
  invitations: Array<number>,
  reportAuthor: number,
  createdBy: number
};

export default createEntityReducer({
  key: 'meetings',
  types: {
    fetch: Meeting.FETCH,
    mutate: Meeting.CREATE
  },
  mutate(state, action) {
    switch (action.type) {
      case Meeting.DELETE.SUCCESS:
        return {
          ...state,
          items: state.items.filter(id => action.meta.meetingId !== id)
        };
      default:
        return state;
    }
  }
});

export const selectMeetings = createSelector(
  state => state.meetings.byId,
  state => state.meetings.items,
  (meetingsById, meetingIds) => meetingIds.map(id => meetingsById[id])
);

export const selectMeetingById = createSelector(
  state => state.meetings.byId,
  (state, props) => props.meetingId,
  (meetingsById, meetingId) => meetingsById[meetingId]
);
