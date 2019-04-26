// @flow
import { createSelector } from 'reselect';
import { Penalty } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
<<<<<<< HEAD
=======
import { without } from 'lodash';
import produce from 'immer';
>>>>>>> Use without instead of pull, refactor some logic for better readability

type State = any;

export default createEntityReducer({
  key: 'penalties',
  types: {
    fetch: Penalty.FETCH,
<<<<<<< HEAD
    mutate: Penalty.CREATE,
    delete: Penalty.DELETE
  }
=======
    mutate: Penalty.CREATE
  },
  mutate: produce(
    (newState: State, action: any): void => {
      switch (action.type) {
        case Penalty.DELETE.SUCCESS:
          newState.items = without(newState.items, action.meta.penaltyId);
      }
    }
  )
>>>>>>> Use without instead of pull, refactor some logic for better readability
});

export const selectPenalties = createSelector(
  state => state.penalties.byId,
  state => state.penalties.items,
  (penaltiesById, penaltyIds) => penaltyIds.map(id => penaltiesById[id])
);

export const selectPenaltyByUserId = createSelector(
  selectPenalties,
  (state, props) => props.userId,
  (penaltiesById, userId) =>
    penaltiesById.filter(penalty => penalty.user === userId)
);
