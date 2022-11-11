import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import {
  createEmailList,
  fetch,
  fetchEmailList,
} from 'app/actions/EmailListActions';
import type EmailList from 'app/store/models/EmailList';
import { EntityType } from 'app/store/models/Entities';
import addEntityReducer, {
  EntityReducerState,
  getInitialEntityReducerState,
} from 'app/store/utils/entityReducer';

export type EmailListEntity = EmailList;

export type EmailListsState = EntityReducerState<EmailList>;

const initialState: EmailListsState = getInitialEntityReducerState();

const emailListsSlice = createSlice({
  name: EntityType.EmailLists,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addEntityReducer(builder, EntityType.CompanySemesters, {
      fetch: [fetch, fetchEmailList],
      mutate: createEmailList,
    });
  },
});

export default emailListsSlice.reducer;

export const selectEmailLists = createSelector(
  (state) => state.emailLists.byId,
  (state) => state.emailLists.items,
  (_, { pagination }) => pagination,
  (emailListsById, emailListIds, pagination) =>
    (pagination ? pagination.items : emailListIds)
      .map((id) => emailListsById[id])
      .filter(Boolean)
);
export const selectEmailListById = createSelector(
  (state) => state.emailLists.byId,
  (state) => state.users.byId,
  (state) => state.groups.byId,
  (state, props) => props.emailListId,
  (emailListsById, usersById, groupsById, emailListId) => {
    const emailList = emailListsById[emailListId];

    if (!emailList) {
      return {};
    }

    return {
      ...emailList,
      groups: emailList.groups.map((groupId) => groupsById[groupId]),
      users: emailList.users.map((userId) => usersById[userId]),
    };
  }
);
