import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { selectUserEntities } from 'app/reducers/users';
import { EntityType } from 'app/store/models/entities';
import { isNotNullish } from 'app/utils';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Membership, Group } from '../actions/ActionTypes';
import type { EntityId } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type { PublicUser } from 'app/store/models/User';
import type { Pagination } from 'app/utils/legoAdapter/buildPaginationReducer';

const legoAdapter = createLegoAdapter(EntityType.Memberships);

const membershipsSlice = createSlice({
  name: EntityType.Memberships,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Group.MEMBERSHIP_FETCH],
    deleteActions: [Membership.LEAVE_GROUP, Membership.REMOVE],
  }),
});

export default membershipsSlice.reducer;

const {
  selectEntities: selectMembershipEntities,
  selectIds: selectMembershipIds,
} = legoAdapter.getSelectors((state: RootState) => state.memberships);

type SelectMembershipsForGroupArgs = {
  descendants?: boolean;
  groupId: EntityId;
  pagination?: Pagination;
};

export type TransformedMembership = ReturnType<
  typeof selectMembershipsForGroup
>[number];
export const selectMembershipsForGroup = createSelector(
  (_: RootState, { descendants = false }: SelectMembershipsForGroupArgs) =>
    descendants,
  (_: RootState, { groupId }: SelectMembershipsForGroupArgs) => groupId,
  (_: RootState, { pagination = undefined }: SelectMembershipsForGroupArgs) =>
    pagination,
  selectMembershipEntities,
  selectMembershipIds,
  selectUserEntities,
  (
    descendants,
    groupId,
    pagination,
    membershipsById,
    membershipsItems,
    userEntities,
  ) => {
    if (!pagination && descendants) {
      throw new Error('using descendants without pagination is not supported');
    }

    const memberships =
      pagination !== undefined
        ? (pagination && pagination.ids) || []
        : membershipsItems;
    if (!memberships) return [];

    return memberships
      .map((m) => membershipsById[m])
      .filter(isNotNullish)
      .filter((m) =>
        descendants ? true : Number(m.abakusGroup) === Number(groupId),
      )
      .map((m) => {
        const userId = m.user;
        const user = userEntities[userId] as PublicUser;
        return { ...m, user };
      });
  },
);
