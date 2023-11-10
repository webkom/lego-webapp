import { createSelector } from 'reselect';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Penalty } from '../actions/ActionTypes';

export default createEntityReducer({
  key: 'penalties',
  types: {
    fetch: Penalty.FETCH,
    mutate: Penalty.CREATE,
    delete: Penalty.DELETE,
  },
});
export const selectPenalties = createSelector(
  (state) => state.penalties.byId,
  (state) => state.penalties.items,
  (penaltiesById, penaltyIds) => penaltyIds.map((id) => penaltiesById[id]),
);
export const selectPenaltyByUserId = createSelector(
  selectPenalties,
  (state, props) => props.userId,
  (penaltiesById, userId) =>
    penaltiesById.filter((penalty) => penalty.user === userId),
);
