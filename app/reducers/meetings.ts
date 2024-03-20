import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import { addCommentCases } from 'app/reducers/comments';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Meeting } from '../actions/ActionTypes';
import { addReactionCases } from './reactions';
import type { RootState } from 'app/store/createRootReducer';
import type { ID } from 'app/store/models';
import type { ListMeeting } from 'app/store/models/Meeting';
import type { Moment } from 'moment-timezone';

export type MeetingSection = {
  title: string;
  meetings: ListMeeting[];
};

const legoAdapter = createLegoAdapter(EntityType.Meetings, {
  sortComparer: (a, b) => moment(a.startTime).diff(moment(b.startTime)),
});

const meetingsSlice = createSlice({
  name: EntityType.Meetings,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Meeting.FETCH],
    deleteActions: [Meeting.DELETE],
    extraCases: (addCase) => {
      addCommentCases(EntityType.Meetings, addCase);
      addReactionCases(EntityType.Meetings, addCase);
    },
  }),
});

export default meetingsSlice.reducer;

export const {
  selectAll: selectAllMeetings,
  selectById: selectMeetingById,
  selectByField: selectMeetingsByField,
} = legoAdapter.getSelectors((state: RootState) => state.meetings);

export const selectGroupedMeetings = createSelector(
  selectAllMeetings,
  (meetings) => {
    const currentTime = moment();
    const currentYear = currentTime.year();
    const currentWeek = currentTime.week();

    const customMeetingGroups: Array<
      MeetingSection & {
        belongsInGroup: (endTime: Moment) => boolean;
        past?: boolean;
      }
    > = [
      {
        title: 'Denne uken',
        meetings: [],
        belongsInGroup: (endTime) =>
          endTime.year() === currentYear &&
          endTime.week() === currentWeek &&
          currentTime < endTime,
      },
      {
        title: 'Neste uke',
        meetings: [],
        belongsInGroup: (endTime) =>
          endTime.year() === currentYear && endTime.week() === currentWeek + 1,
      },
      {
        title: 'Senere dette semesteret',
        meetings: [],
        belongsInGroup: (endTime) =>
          endTime.year() === currentYear && endTime.week() > currentWeek + 1,
      },
      {
        title: 'Tidligere denne uken',
        meetings: [],
        past: true,
        belongsInGroup: (endTime) =>
          endTime.year() === currentYear &&
          endTime.week() === currentWeek &&
          currentTime > endTime,
      },
      {
        title: 'Forrige uke',
        meetings: [],
        past: true,
        belongsInGroup: (endTime) =>
          endTime.year() === currentYear && endTime.week() === currentWeek - 1,
      },
    ];

    // Account for the possibility of items being loaded before others - messing up the sorting
    // Sorted descendingly to generate semesters in the correct order
    const sortedMeetings: ListMeeting[] = (meetings as ListMeeting[]).sort(
      (meeting1, meeting2) =>
        Number(moment(meeting2.endTime)) - Number(moment(meeting1.endTime)),
    );

    const olderMeetingGroupObj: {
      [title: string]: { title: string; meetings: ListMeeting[] };
    } = {};

    // Map meetings to groups
    sortedMeetings.forEach((meeting) => {
      const meetingEndTime = moment(meeting.endTime);

      // Group meetings in custom groups
      for (let i = 0; i < customMeetingGroups.length; i++) {
        if (customMeetingGroups[i].belongsInGroup(meetingEndTime)) {
          customMeetingGroups[i].meetings.push(meeting);
          return;
        }
      }

      // Group remaining meetings based on their semester
      const groupTitle =
        (meetingEndTime.quarter() >= 3 ? 'Høsten' : 'Våren') +
        (' ' + meetingEndTime.year());
      if (!(groupTitle in olderMeetingGroupObj)) {
        olderMeetingGroupObj[groupTitle] = {
          title: groupTitle,
          meetings: [],
        };
      }
      olderMeetingGroupObj[groupTitle].meetings.push(meeting);
    });

    // Reverse all the meeting groups that are in the future
    customMeetingGroups.forEach(
      (customMeetingGroup) =>
        !customMeetingGroup.past && customMeetingGroup.meetings.reverse(),
    );

    const semesterMeetingGroups: MeetingSection[] = Object.entries(
      olderMeetingGroupObj,
    ).map(([title, { meetings }]) => ({ title, meetings }));

    // Merge the custom meeting groups with the semester groups
    return customMeetingGroups
      .map<MeetingSection>(({ title, meetings }) => ({ title, meetings }))
      .concat(semesterMeetingGroups)
      .filter((meetingGroup) => meetingGroup.meetings.length !== 0);
  },
);

export const selectUpcomingMeetings = (state: RootState) =>
  selectMeetingsByField('endTime', (endTime, filterTime) =>
    moment(endTime).isAfter(filterTime),
  )(state, moment()).sort((a, b) =>
    moment(a.startTime).diff(moment(b.startTime)),
  );

export const selectUpcomingMeetingId = createSelector(
  selectUpcomingMeetings,
  (upcomingMeetings) => upcomingMeetings[0]?.id as ID | undefined,
);
