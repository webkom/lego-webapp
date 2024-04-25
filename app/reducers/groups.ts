import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { addMember, leaveGroup, removeMember } from 'app/actions/GroupActions';
import { GroupType } from 'app/models';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Group, Membership } from '../actions/ActionTypes';
import type { EntityId, AnyAction } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';

export const resolveGroupLink = (group: { type: GroupType; id: EntityId }) => {
  switch (group.type) {
    case GroupType.Interest:
      return `/interest-groups/${group.id}`;

    case GroupType.Committee:
      return `/pages/komiteer/${group.id}`;

    case GroupType.Revue:
      return `/pages/revy/${group.id}`;

    default:
      return null;
  }
};

const legoAdapter = createLegoAdapter(EntityType.Groups);

const changeNumberOfUsers =
  <A>(by: number, groupIdSelector: (action: A) => EntityId) =>
  (state: ReturnType<typeof legoAdapter.getInitialState>, action: A) => {
    const group = state.entities[groupIdSelector(action)];
    if ('numberOfUsers' in group && typeof group.numberOfUsers === 'number') {
      group.numberOfUsers += by;
    }
  };

const groupsSlice = createSlice({
  name: EntityType.Groups,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Group.FETCH],
    extraCases: (addCase) => {
      addCase(
        addMember.fulfilled,
        changeNumberOfUsers(1, (a) => a.meta.extra.groupId),
      );
      addCase(
        removeMember.fulfilled,
        changeNumberOfUsers(-1, (a) => a.meta.extra.groupId),
      );
      addCase(
        leaveGroup.fulfilled,
        changeNumberOfUsers(-1, (a) => a.meta.extra.groupId),
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
