import { produce } from 'immer';
import { without } from 'lodash';
import { createSelector } from 'reselect';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Penalty } from '../actions/ActionTypes';

type State = any;
const mutate = produce((newState: State, action: any): void => {
  switch (action.type) {
    case Penalty.DELETE.SUCCESS:
      newState.items = without(newState.items, action.meta.penaltyId);
      break;
  }
});

export default createEntityReducer({
  key: 'penalties',
  types: {
    fetch: Penalty.FETCH,
    mutate: Penalty.CREATE,
    delete: Penalty.DELETE,
  },
  mutate,
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
