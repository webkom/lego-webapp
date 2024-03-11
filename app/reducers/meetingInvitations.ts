import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { createMeetingInvitationId } from 'app/reducers/index';
import { selectUserEntities } from 'app/reducers/users';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Meeting } from '../actions/ActionTypes';
import { selectMeetingById } from './meetings';
import type { AnyAction, EntityId } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type { ID } from 'app/store/models';
import type {
  MeetingInvitation,
  MeetingInvitationStatus,
} from 'app/store/models/MeetingInvitation';
import type { PublicUser } from 'app/store/models/User';

export const statusesText: {
  [value in MeetingInvitationStatus]: string;
} = {
  NO_ANSWER: 'Ikke svart',
  ATTENDING: 'Deltar',
  NOT_ATTENDING: 'Deltar ikke',
};

const legoAdapter = createLegoAdapter(EntityType.MeetingInvitations, {
  selectId: (model) => createMeetingInvitationId(model.meeting, model.user),
});

const meetingInvitationsSlice = createSlice({
  name: EntityType.MeetingInvitations,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    extraCases: (addCase) => {
      addCase(
        Meeting.SET_INVITATION_STATUS.SUCCESS,
        (state, action: AnyAction) => {
          const { meetingId, status, user } = action.meta;
          legoAdapter.upsertOne(state, {
            meeting: meetingId,
            user: user.id,
            status,
          });
        },
      );
    },
  }),
});

export default meetingInvitationsSlice.reducer;

export const {
  selectById: selectMeetingInvitationById,
  selectEntities: selectMeetingInvitationEntities,
} = legoAdapter.getSelectors((state: RootState) => state.meetingInvitations);

export const selectMeetingInvitationByMeetingIdAndUserId = (
  state: RootState,
  meetingId: EntityId,
  userId: EntityId,
) =>
  selectMeetingInvitationById(
    state,
    createMeetingInvitationId(meetingId, userId),
  );

export type MeetingInvitationWithUser = Omit<MeetingInvitation, 'user'> & {
  id: ID;
  user: PublicUser;
};

export const selectMeetingInvitationsForMeeting = createSelector(
  selectMeetingById,
  selectMeetingInvitationEntities,
  selectUserEntities,
  (meeting, meetingInvitationEntities, userEntities) => {
    const meetingInvitationIds = meeting?.invitations;
    if (!meetingInvitationIds) return [];
    return meetingInvitationIds
      .map((invitationId) => meetingInvitationEntities[invitationId])
      .map((invitation) => {
        const userId = invitation.user;
        const user = userEntities[userId];
        return { ...invitation, user };
      }) satisfies MeetingInvitationWithUser[];
  },
);
