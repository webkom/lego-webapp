import { createSelector } from 'reselect';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Joblistings } from '../actions/ActionTypes';

export default createEntityReducer({
  key: 'joblistings',
  types: {
    fetch: Joblistings.FETCH,
    mutate: Joblistings.CREATE,
    delete: Joblistings.DELETE,
  },
});
export const selectJoblistings = createSelector(
  (state) => state.joblistings.byId,
  (state) => state.joblistings.items,
  (joblistingsById, joblistingIds) =>
    joblistingIds.map((id) => joblistingsById[id])
);
export const selectJoblistingById = createSelector(
  (state) => state.joblistings.byId,
  (state, props) => props.joblistingId,
  (joblistingsById, joblistingId) => joblistingsById[joblistingId]
);
export const selectJoblistingBySlug = createSelector(
  (state) => state.joblistings.byId,
  (state, props) => props.joblistingSlug,
  (joblistingsById, joblistingSlug) => {
    const joblisting = Object.values(joblistingsById).find(
      (joblisting) => joblisting.slug === joblistingSlug
    );
    return joblisting;
  }
);
