/**
 * Return the new state after `reducers` has been run
 * in sequence with the nextState being the value of a
 * reduced prevState.
 */
export default function joinReducers(...reducers) {
  return (state, action) => {
    return reducers.reduceRight((nextState, reducer) => reducer(nextState, action), state);
  };
}
