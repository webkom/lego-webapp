import { createSelector } from 'reselect';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Membership } from '../actions/ActionTypes';
import { selectInterestGroupById } from './interestGroups';

export default createEntityReducer({
  key: 'memberships',
  types: {
    mutate: Membership.JOIN_GROUP
  },
  mutate(state, action) {
    switch (action.type) {
      case Membership.LEAVE_GROUP.SUCCESS: {
        const { groupId, username } = action.meta;
        return {
          ...state,
          items: state.items.filter(i => {
            const m = state.byId[i];
            return m.abakusGroup !== groupId || m.user !== username;
          })
        };
      }
      case Membership.MEMBER_SET.SUCCESS: {
        const groupId = action.meta.id;
        const newMembershipIds = action.payload.result;
        const currentMemberships = state.items.map(id => state.byId[id]);

        const newMemberships = currentMemberships.filter(
          m =>
            // we want the memberships that are from other groups,
            // as well as the memberships which Id is in the `newMembershipIds`
            m.abakusGroup !== groupId || newMembershipIds.includes(m.id)
        );
        const newMembershipItems = newMemberships.map(m => m.id);

        const byId = {};
        newMemberships.map(m => (byId[m.id] = m));
        const items = newMembershipItems;

        const returnState = {
          ...state,
          byId,
          items
        };

        return returnState;
      }
    }
    return state;
  }
});

export const selectMembershipsForInterestGroup = createSelector(
  selectInterestGroupById,
  state => state.memberships.byId,
  state => state.users.byId,
  (group, membershipsById, users) => {
    const memberships = group.memberships;
    if (!memberships) return [];
    return memberships.map(m => membershipsById[m]).map(m => {
      const userId = m.user;
      const user = users[userId];
      return {
        ...m,
        user
      };
    });
  }
);
