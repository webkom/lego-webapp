// @flow

import { createSelector } from 'reselect';
import { EmailList } from '../actions/ActionTypes';
import { mutateComments } from 'app/reducers/comments';
import createEntityReducer from 'app/utils/createEntityReducer';

export type EmailListEntity = {
  id: number,
  title: string,
  commentTarget: string,
  description: string,
  author: number,
  cover: string,
  createdAt: string,
  content: string,
  startTime: string,
  text: string,
  tags: Array<string>,
  actionGrant: Object,
  comments: Array<number>
};

const mutate = mutateComments('emailLists');

export default createEntityReducer({
  key: 'emailLists',
  types: {
    fetch: EmailList.FETCH,
    mutate: EmailList.CREATE
  },
  mutate
});

export const selectEmailLists = createSelector(
  state => state.emailLists.byId,
  state => state.emailLists.items,
  (emailListsById, emailListIds) => emailListIds.map(id => emailListsById[id])
);

export const selectEmailListById = createSelector(
  state => state.emailLists.byId,
  state => state.users.byId,
  state => state.groups.byId,
  (state, props) => props.emailListId,
  (emailListsById, usersById, groupsById, emailListId) => {
    const emailList = emailListsById[emailListId];

    if (!emailList) {
      return {};
    }

    return {
      ...emailList,
      groups: emailList.groups.map(groupId => groupsById[groupId]),
      users: emailList.users.map(userId => usersById[userId])
    };
  }
);
