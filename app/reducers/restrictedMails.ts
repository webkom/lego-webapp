import { createSelector } from 'reselect';
import { RestrictedMail } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export default createEntityReducer({
  key: 'restrictedMails',
  types: {
    fetch: RestrictedMail.FETCH,
    mutate: RestrictedMail.CREATE
  }
});

export const selectRestrictedMails = createSelector(
  state => state.restrictedMails.byId,
  state => state.restrictedMails.items,
  (restrictedMailsById, restrictedMailIds) =>
    restrictedMailIds.map(id => restrictedMailsById[id])
);

export const selectRestrictedMailById = createSelector(
  state => state.restrictedMails.byId,
  (state, props) => props.restrictedMailId,
  (restrictedMailsById, restrictedMailId) =>
    restrictedMailsById[restrictedMailId] || {}
);
