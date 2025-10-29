import { createSlice } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';
import { createSelector } from 'reselect';
import { User, Event, MembershipHistory } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { eventSchema, registrationSchema } from '~/redux/schemas';
import { selectGroupEntities } from '~/redux/slices/groups';
import type { AnyAction, EntityId } from '@reduxjs/toolkit';
import type { PhotoConsent } from 'app/models';
import type {
  CurrentUser,
  PublicUserWithAbakusGroups,
} from '~/redux/models/User';
import type { RootState } from '~/redux/rootReducer';

export type UserEntity = {
  id: number;
  username: string;
  fullName: string;
  firstName: string;
  lastName: string;
  gender: string;
  profilePicture: string;
  profilePicturePlaceholder?: string;
  emailListsEnabled?: boolean;
  selectedTheme?: string;
  photoConsents?: Array<PhotoConsent>;
  isStudent?: boolean;
  commandSuggestions?: Array<string>;
};

const legoAdapter = createLegoAdapter(EntityType.Users);

const usersSlice = createSlice({
  name: EntityType.Users,
  initialState: legoAdapter.getInitialState({
    fetchingAchievements: false,
  }),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [User.FETCH, User.FETCH_LEADERBOARD],
    extraCases: (addCase) => {
      addCase(Event.SOCKET_EVENT_UPDATED, (state, action: AnyAction) => {
        const users = normalize(action.payload, eventSchema).entities.users!;
        if (!users) return;
        legoAdapter.upsertMany(state, users);
      });
      addCase(User.FETCH_LEADERBOARD.BEGIN, (state) => {
        state.fetchingAchievements = true;
      });
      addCase(User.FETCH_LEADERBOARD.SUCCESS, (state) => {
        state.fetchingAchievements = false;
      });
      addCase(User.FETCH_LEADERBOARD.FAILURE, (state) => {
        state.fetchingAchievements = false;
      });
      addCase(MembershipHistory.DELETE.SUCCESS, (state, action) => {
        const user = state.entities[action.meta.userId] as CurrentUser;
        user.pastMemberships = user.pastMemberships.filter(
          (membership) => membership.abakusGroup.id !== action.meta.groupId,
        );
      });
    },
    extraMatchers: (addMatcher) => {
      addMatcher(
        (action) =>
          action.type === Event.SOCKET_REGISTRATION.SUCCESS ||
          action.type === Event.ADMIN_REGISTER.SUCCESS,
        (state, action: AnyAction) => {
          if (!action.payload.user) return;
          const users = normalize(action.payload, registrationSchema).entities
            .users!;
          legoAdapter.upsertMany(state, users);
        },
      );
    },
  }),
});

export default usersSlice.reducer;

export const {
  selectById: selectUserById,
  selectEntities: selectUserEntities,
  selectByField: selectUsersByField,
} = legoAdapter.getSelectors((state: RootState) => state.users);
export const selectUserByUsername = selectUsersByField('username').single;

export const selectUsersByIds = createSelector(
  selectUserEntities,
  (_: RootState, userIds: EntityId[] = []) => userIds,
  (userEntities, userIds) => userIds.map((userId) => userEntities[userId]),
);

export const selectUserWithGroups = createSelector(
  (
    state: RootState,
    {
      username,
      userId,
    }: {
      username?: string;
      userId?: EntityId;
    },
  ) =>
    username
      ? selectUserByUsername(state, username)
      : selectUserById(state, userId),
  selectGroupEntities,
  (user, groupEntities) => {
    if (!user) return;
    return {
      ...user,
      abakusGroups:
        'abakusGroups' in user
          ? (user.abakusGroups as EntityId[]).map(
              (groupId) => groupEntities[groupId],
            )
          : [],
    };
  },
);

export const selectUsersWithAchievementsScore = createSelector(
  selectUserEntities,
  (userEntities): PublicUserWithAbakusGroups[] => {
    return Object.values(userEntities).filter(
      (user): user is PublicUserWithAbakusGroups =>
        user.achievementsScore != null,
    );
  },
);
