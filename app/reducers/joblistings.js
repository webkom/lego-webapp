// @flow

import { omit } from 'lodash';
import { Joblistings } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';

export default createEntityReducer({
  key: 'joblistings',
  types: {
    fetch: Joblistings.FETCH
  },
  mutate(state, action) {
    switch (action.type) {
      case Joblistings.DELETE.SUCCESS: {
        return {
          ...state,
          byId: {
            ...omit(state.byId, action.meta.id)
          }
        };
      }
      default:
        return state;
    }
  }
});

export const selectJoblistingById = createSelector(
  state => state.joblistings.byId,
  (state, props) => props.joblistingId,
  (joblistingsById, joblistingId) => joblistingsById[joblistingId]
);
