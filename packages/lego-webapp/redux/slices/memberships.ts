import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { isNotNullish } from 'app/utils';
import { Membership, Group } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { selectUserEntities } from '~/redux/slices/users';
import type { EntityId } from '@reduxjs/toolkit';
import type { Pagination } from '~/redux/legoAdapter/buildPaginationReducer';
import type { PublicUser } from '~/redux/models/User';
import type { RootState } from '~/redux/rootReducer';

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
