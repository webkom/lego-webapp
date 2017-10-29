// @flow

import { Meeting } from '../actions/ActionTypes';
import { selectMeetingById } from './meetings';
import { createSelector } from 'reselect';
import createEntityReducer from 'app/utils/createEntityReducer';
import type { UserEntity } from './users';

export const statusesText = {
  NO_ANSWER: 'Ikke svart',
  ATTENDING: 'Deltar',
  NOT_ATTENDING: 'Deltar ikke'
};

export const statuses = {
  NO_ANSWER: 'NO_ANSWER',
  ATTENDING: 'ATTENDING',
  NOT_ATTENDING: 'NOT_ATTENDING'
};

export const getMeetingInvitationId = (meetingId: number, username: string) =>
  `${meetingId}-${username}`;

export type MeetingInvitationStatus = $Keys<typeof statuses>;

export type MeetingInvitationEntity = {
  user: UserEntity,
  status: MeetingInvitationStatus,
  meeting: number
};

export default createEntityReducer({
  key: 'meetingInvitations',
  types: {},
  mutate(state, action) {
    switch (action.type) {
      case Meeting.SET_INVITATION_STATUS.SUCCESS: {
        const { meetingId, status, user } = action.meta;
        const invitationId = getMeetingInvitationId(meetingId, user.username);
        return {
          ...state,
          byId: {
            ...state.byId,
            [invitationId]: {
              ...state.byId[invitationId],
              status: status
            }
          }
        };
      }
      default:
        return state;
    }
  }
});

export const selectMeetingInvitation = createSelector(
  state => state.meetingInvitations.byId,
  (state, props) => props.meetingId,
  (state, props) => props.userId,
  (meetingInvitationsById, meetingId, userId) =>
    meetingInvitationsById[getMeetingInvitationId(meetingId, userId)]
);

export const selectMeetingInvitationsForMeeting = createSelector(
  selectMeetingById,
  state => state.meetingInvitations.byId,
  state => state.users.byId,
  (meeting, meetingInvitationsById, users) => {
    const meetingInvitations = meeting.invitations;
    if (!meetingInvitations) return [];
    return meetingInvitations
      .map(invitation => meetingInvitationsById[invitation])
      .map(invitation => {
        const userId = invitation.user;
        const user = users[userId];
        return {
          ...invitation,
          user
        };
      });
  }
);
