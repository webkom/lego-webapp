import { createSelector } from 'reselect';
import createEntityReducer from 'app/utils/createEntityReducer';
import { RestrictedMail } from '../actions/ActionTypes';

export type RestrictedMailEntity = {
  id: number;
  fromAddress: string;
  hideAddress: boolean;
  used: boolean;
  users: Array<number>;
  groups: Array<number>;
  events: Array<number>;
  meetings: Array<number>;
  rawAddresses: Array<string>;
};
export default createEntityReducer({
  key: 'restrictedMails',
  types: {
    fetch: RestrictedMail.FETCH,
    mutate: RestrictedMail.CREATE,
  },
});
export const selectRestrictedMails = createSelector(
  (state) => state.restrictedMails.byId,
  (state) => state.restrictedMails.items,
  (restrictedMailsById, restrictedMailIds) =>
    restrictedMailIds.map((id) => restrictedMailsById[id]),
);
export const selectRestrictedMailById = createSelector(
  (state) => state.restrictedMails.byId,
  (state, props) => props.restrictedMailId,
  (restrictedMailsById, restrictedMailId) =>
    restrictedMailsById[restrictedMailId] || {},
);
