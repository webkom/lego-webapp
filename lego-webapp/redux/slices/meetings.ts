import { createSlice } from '@reduxjs/toolkit';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import { Meeting } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { addCommentCases } from '~/redux/slices/comments';
import { fetchMeeting } from '../actions/MeetingActions';
import { useAppDispatch, useAppSelector } from '../hooks';
import { addReactionCases } from './reactions';
import type { EntityId } from '@reduxjs/toolkit';
import type { Moment } from 'moment-timezone';
import type { AnyAction } from 'redux';
import type { DetailedMeeting, ListMeeting } from '~/redux/models/Meeting';
import type { MeetingInvitationStatus } from '~/redux/models/MeetingInvitation';
import type { PublicUser } from '~/redux/models/User';
import type { RootState } from '~/redux/rootReducer';

export enum MeetingTokenResponse {
  Failure = 'FAILURE',
  Success = 'SUCCESS',
}
export type MeetingTokenSuccessState = {
  response: MeetingTokenResponse.Success;
  user: PublicUser;
  meeting: EntityId;
  status: MeetingInvitationStatus;
};
export type MeetingTokenState =
  | {
      response?: MeetingTokenResponse.Failure;
    }
  | MeetingTokenSuccessState;

const legoAdapter = createLegoAdapter(EntityType.Meetings, {
  sortComparer: (a, b) => moment(a.startTime).diff(moment(b.startTime)),
});

const meetingsSlice = createSlice({
  name: EntityType.Meetings,
  initialState: legoAdapter.getInitialState({
    meetingToken: {} as MeetingTokenState,
  }),
  reducers: {
    resetMeetingToken(state) {
      state.meetingToken = {};
    },
  },
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Meeting.FETCH, Meeting.FETCH_TEMPLATES],
    deleteActions: [Meeting.DELETE],
    extraCases: (addCase) => {
      addCommentCases(EntityType.Meetings, addCase);
      addReactionCases(EntityType.Meetings, addCase);

      addCase(Meeting.ANSWER_INVITATION_TOKEN.FAILURE, (state) => {
        state.meetingToken = { response: MeetingTokenResponse.Failure };
      });
      addCase(
        Meeting.ANSWER_INVITATION_TOKEN.SUCCESS,
        (state, action: AnyAction) => {
          const { meeting, user, status } = action.payload;
          state.meetingToken = {
            response: MeetingTokenResponse.Success,
            user,
            meeting,
            status,
          };
        },
      );
    },
  }),
});

export default meetingsSlice.reducer;
export const { resetMeetingToken } = meetingsSlice.actions;

export const {
  selectAll: selectAllMeetings,
  selectById: selectMeetingById,
  selectByField: selectMeetingsByField,
} = legoAdapter.getSelectors((state: RootState) => state.meetings);

export type MeetingSection = {
  title: string;
  meetings: ListMeeting[];
};
export const selectGroupedMeetings = createSelector(
  selectAllMeetings,
  (meetings) => {
    const filteredMeetings = meetings.filter((m) => !m.isTemplate);
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
    const sortedMeetings: ListMeeting[] = (
      filteredMeetings as ListMeeting[]
    ).sort(
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
  )(state, moment())
    .sort((a, b) => moment(a.startTime).diff(moment(b.startTime)))
    .filter((meeting: ListMeeting) => !meeting.isTemplate);

export const selectUpcomingMeetingId = createSelector(
  selectUpcomingMeetings,
  (upcomingMeetings) => upcomingMeetings[0]?.id as EntityId | undefined,
);

export const selectMyMeetingTemplates = createSelector(
  (state: RootState) => state.auth.id,
  (state: RootState) =>
    selectMeetingsByField(
      'isTemplate',
      (isTemplate) => isTemplate === true,
    )(state),
  (selfId, recurringMeetings) =>
    recurringMeetings.filter(
      (meeting: ListMeeting) => meeting.createdBy === selfId,
    ) as ListMeeting[],
);

export const useFetchedMeetingTemplate = (
  prepareId: string,
  id?: EntityId,
): DetailedMeeting | undefined => {
  const dispatch = useAppDispatch();
  usePreparedEffect(
    `useFetchedMeetingTemplate-${prepareId}`,
    () => id && dispatch(fetchMeeting(id.toString())),
    [id],
  );
  return useAppSelector((state: RootState) => selectMeetingById(state, id));
};
