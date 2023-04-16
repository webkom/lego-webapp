import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import { mutateComments } from 'app/reducers/comments';
import type { ListMeeting } from 'app/store/models/Meeting';
import createEntityReducer from 'app/utils/createEntityReducer';
import joinReducers from 'app/utils/joinReducers';
import { Meeting } from '../actions/ActionTypes';
import { mutateReactions } from './reactions';

export type MeetingSection = {
  title: string;
  meetings: ListMeeting[];
};

const mutate = joinReducers(
  mutateComments('meetings'),
  mutateReactions('meetings')
);

export default createEntityReducer({
  key: 'meetings',
  types: {
    fetch: Meeting.FETCH,
    mutate: Meeting.CREATE,
    delete: Meeting.DELETE,
  },
  mutate,
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
export const selectCommentsForMeeting = createSelector(
  selectMeetingById,
  (state) => state.comments.byId,
  (meeting, commentsById) => {
    if (!meeting || !meeting.comments) return [];
    return meeting.comments.map((commentId) => commentsById[commentId]);
  }
);

export const selectGroupedMeetings = createSelector(
  selectMeetings,
  (meetings) => {
    const currentYear = moment().year();
    const currentWeek = moment().week();
    const pools: Array<MeetingSection> = [
      {
        title: 'Denne uken',
        meetings: [],
      },
      {
        title: 'Neste uke',
        meetings: [],
      },
      {
        title: 'Senere dette semesteret',
        meetings: [],
      },
    ];
    const fields = {};
    meetings.forEach((meeting) => {
      const startTime = moment(meeting.startTime);
      const year = startTime.year();
      const week = startTime.week();
      const quarter = startTime.quarter();

      if (
        year === currentYear &&
        week === currentWeek &&
        moment() < startTime
      ) {
        pools[0].meetings.push(meeting);
      } else if (year === currentYear && week === currentWeek + 1) {
        pools[1].meetings.push(meeting);
      } else if (year === currentYear && week > currentWeek) {
        pools[2].meetings.push(meeting);
      } else {
        // Sort other meetings with their semester-code. eg V2017
        const title =
          (Math.ceil(quarter / 2) - 1 ? 'H' : 'V') + year.toString();
        fields[title] = fields[title] || {
          title,
          meetings: [],
        };
        fields[title].meetings.push(meeting);
      }
    });
    const oldMeetings = Object.keys(fields)
      .map((key) => ({
        title: key,
        meetings: fields[key].meetings.sort(
          (elem1, elem2) => moment(elem2.startTime) - moment(elem1.startTime)
        ),
      }))
      .sort((elem1, elem2) => {
        const year1 = elem1.title.substring(1, 5);
        const year2 = elem2.title.substring(1, 5);

        if (year1 === year2) {
          return elem1.title > elem2.title ? 1 : -1;
        }

        return Number(year2) - Number(year1);
      });
    return pools
      .map((pool) => ({
        title: pool.title,
        meetings: pool.meetings.sort(
          (elem1, elem2) =>
            Number(moment(elem1.startTime)) - Number(moment(elem2.startTime))
        ),
      }))
      .concat(oldMeetings)
      .filter((elem) => elem.meetings.length);
  }
);
