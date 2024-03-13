import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { EmailList } from '../actions/ActionTypes';
import type { RootState } from 'app/store/createRootReducer';

export type EmailListEntity = {
  id: number;
  title: string;
  contentTarget: string;
  description: string;
  author: number;
  cover: string;
  createdAt: string;
  content: string;
  startTime: string;
  text: string;
  tags: Array<string>;
  actionGrant: Record<string, any>;
  comments: Array<number>;
};

const legoAdapter = createLegoAdapter(EntityType.EmailLists);

const emailListSlice = createSlice({
  name: EntityType.EmailLists,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [EmailList.FETCH],
  }),
});

export default emailListSlice.reducer;
const { selectAllPaginated: selectEmailLists, selectById } =
  legoAdapter.getSelectors<RootState>((state) => state.emailLists);
export { selectEmailLists };

export const selectEmailListById = createSelector(
  selectById,
  (state: RootState) => state.users.byId,
  (state: RootState) => state.groups.byId,
  (emailList, usersById, groupsById) => {
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
