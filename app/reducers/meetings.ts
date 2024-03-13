import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import { mutateComments, selectCommentEntities } from 'app/reducers/comments';
import createEntityReducer from 'app/utils/createEntityReducer';
import joinReducers from 'app/utils/joinReducers';
import { Meeting } from '../actions/ActionTypes';
import { mutateReactions } from './reactions';
import type { RootState } from 'app/store/createRootReducer';
import type { ID } from 'app/store/models';
import type { ListMeeting } from 'app/store/models/Meeting';
import type { Moment } from 'moment-timezone';

export type MeetingSection = {
  title: string;
  meetings: ListMeeting[];
};

const mutate = joinReducers(
  mutateComments('meetings'),
  mutateReactions('meetings'),
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
  (meetingsById, meetingIds) => meetingIds.map((id) => meetingsById[id]),
);
export const selectMeetingById = createSelector(
  (state) => state.meetings.byId,
  (state, props) => props.meetingId,
  (meetingsById, meetingId) => meetingsById[meetingId],
);
export const selectCommentsForMeeting = createSelector(
  selectMeetingById,
  selectCommentEntities,
  (meeting, commentEntities) => {
    if (!meeting || !meeting.comments) return [];
    return meeting.comments.map((commentId) => commentEntities[commentId]);
  },
);

export const selectGroupedMeetings = createSelector(
  selectMeetings,
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

export const selectUpcomingMeetings = createSelector(
  (state: RootState) => state.meetings.byId,
  (state: RootState) => state.meetings.items,
  (meetingsById, meetingIds) =>
    meetingIds
      .map((id) => meetingsById[id])
      .filter((meeting: any) => moment(meeting.endTime).isAfter(moment()))
      .sort((meetingA: any, meetingB: any) =>
        moment(meetingA.startTime).isAfter(moment(meetingB.startTime)) ? 1 : -1,
      ) as unknown as ListMeeting[],
);

export const selectUpcomingMeetingId = createSelector(
  selectUpcomingMeetings,
  (upcomingMeetings) => upcomingMeetings[0]?.id as ID | undefined,
);
