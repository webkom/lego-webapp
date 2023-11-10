import { createSelector } from 'reselect';
import { mutateComments } from 'app/reducers/comments';
import createEntityReducer from 'app/utils/createEntityReducer';
import { EmailList } from '../actions/ActionTypes';

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
const mutate = mutateComments('emailLists');
export default createEntityReducer({
  key: 'emailLists',
  types: {
    fetch: EmailList.FETCH,
    mutate: EmailList.CREATE,
  },
  mutate,
});
export const selectEmailLists = createSelector(
  (state) => state.emailLists.byId,
  (state) => state.emailLists.items,
  (_, { pagination }) => pagination,
  (emailListsById, emailListIds, pagination) =>
    (pagination ? pagination.items : emailListIds)
      .map((id) => emailListsById[id])
      .filter(Boolean),
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
  },
);
