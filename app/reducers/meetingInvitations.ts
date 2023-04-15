import { produce } from 'immer';
import { createSelector } from 'reselect';
import type { User } from 'app/models';
import type { MeetingInvitationStatus } from 'app/store/models/MeetingInvitation';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Meeting } from '../actions/ActionTypes';
import { selectMeetingById } from './meetings';

export const statusesText: {
  [value in MeetingInvitationStatus]: string;
} = {
  NO_ANSWER: 'Ikke svart',
  ATTENDING: 'Deltar',
  NOT_ATTENDING: 'Deltar ikke',
};

export const getMeetingInvitationId = (meetingId: number, username: string) =>
  `${meetingId}-${username}`;

export type MeetingInvitationEntity = {
  user: User;
  status: MeetingInvitationStatus;
  meeting: number;
};

export default createEntityReducer({
  key: 'meetingInvitations',
  types: {},
  mutate: produce((newState: any, action: any): void => {
    switch (action.type) {
      case Meeting.SET_INVITATION_STATUS.SUCCESS: {
        const { meetingId, status, user } = action.meta;
        const invitationId = getMeetingInvitationId(meetingId, user.username);
        newState.byId[invitationId].status = status;
        break;
      }

      default:
        break;
    }
  }),
});

export const selectMeetingInvitation = createSelector(
  (state) => state.meetingInvitations.byId,
  (state, props) => props.meetingId,
  (state, props) => props.userId,
  (meetingInvitationsById, meetingId, userId) =>
    meetingInvitationsById[getMeetingInvitationId(meetingId, userId)]
);
export const selectMeetingInvitationsForMeeting = createSelector(
  selectMeetingById,
  (state) => state.meetingInvitations.byId,
  (state) => state.users.byId,
  (meeting, meetingInvitationsById, users) => {
    const meetingInvitations = meeting.invitations;
    if (!meetingInvitations) return [];
    return meetingInvitations
      .map((invitation) => ({
        ...meetingInvitationsById[invitation],
        id: invitation,
      }))
      .map((invitation) => {
        const userId = invitation.user;
        const user = users[userId];
        return { ...invitation, user };
      });
  }
);
