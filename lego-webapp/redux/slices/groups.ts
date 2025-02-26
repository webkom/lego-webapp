import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { GroupType } from 'app/models';
import { Group, Membership } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import type { EntityId, AnyAction } from '@reduxjs/toolkit';
import type { RootState } from '~/redux/rootReducer';

export const resolveGroupLink = (group: { type: GroupType; id: EntityId }) => {
  switch (group.type) {
    case GroupType.Interest:
      return `/interest-groups/${group.id}`;

    case GroupType.Committee:
      return `/pages/komiteer/${group.id}`;

    case GroupType.Revue:
      return `/pages/revy/${group.id}`;

    case GroupType.Board:
      return `/pages/styrer/${group.id}`;

    default:
      return null;
  }
};

const legoAdapter = createLegoAdapter(EntityType.Groups);

const groupsSlice = createSlice({
  name: EntityType.Groups,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Group.FETCH],
    extraCases: (addCase) => {
      addCase(Membership.CREATE.SUCCESS, (state, action: AnyAction) => {
        if (!state.entities[action.meta.groupId]) {
          return;
        }

        const group = state.entities[action.meta.groupId];
        if (
          'numberOfUsers' in group &&
          typeof group.numberOfUsers === 'number'
        ) {
          group.numberOfUsers += 1;
        }
      });
    },
    extraMatchers: (addMatcher) => {
      addMatcher(
        (action) =>
          action.type === Membership.REMOVE.SUCCESS ||
          action.type === Membership.LEAVE_GROUP.SUCCESS,
        (state, action: AnyAction) => {
          if (!state.entities[action.meta.groupId]) {
            return;
          }

          const group = state.entities[action.meta.groupId];
          if (
            'numberOfUsers' in group &&
            typeof group.numberOfUsers === 'number'
          ) {
            group.numberOfUsers -= 1;
          }
        },
      );
    },
  }),
});

export default groupsSlice.reducer;

export const {
  selectAll: selectAllGroups,
  selectById: selectGroupById,
  selectEntities: selectGroupEntities,
  selectByField: selectGroupsByField,
} = legoAdapter.getSelectors((state: RootState) => state.groups);

export const selectGroupsByIds = createSelector(
  selectGroupEntities,
  (_: RootState, groupIds: EntityId[] = []) => groupIds,
  (groupsById, groupIds) => groupIds.map((id) => groupsById[id]),
);
export const selectGroupsByType = selectGroupsByField('type');
