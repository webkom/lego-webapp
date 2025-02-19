import type { AnyAction, Reducer } from '@reduxjs/toolkit';

// Don't allow passing in undefined state
export type StrictReducer<State, Action = AnyAction> = (
  state: State,
  action: Action,
) => State;

/**
 * Return the new state after `reducers` has been run
 * in sequence with the nextState being the value of a
 * reduced prevState.
 */

export default function joinReducers<S, A extends AnyAction = AnyAction>(
  ...reducers: Reducer<S, A>[]
): Reducer<S, A> {
  return (state, action) =>
    reducers.reduce((nextState, reducer) => {
      if (typeof reducer !== 'function') {
        return nextState;
      }

      return reducer(nextState, action);
    }, state as S);
}
