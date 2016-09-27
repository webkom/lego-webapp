// @flow

import union from 'lodash/union';
import merge from 'lodash/merge';

type EntityReducerOptions = {
  key: string,
  reducer?: (state: ?Object) => ?Object,
  types: [string, string, string]
};

export default function createEntityReducer({
  key,
  types
}: EntityReducerOptions) {
  const [fetchType, fetchSuccessType, fetchFailureType] = types;

  function byId(state: Object = {}, action: any) {
    if (action.payload && action.payload.entities && action.payload.entities[key]) {
      return merge({}, state, action.payload.entities[key]);
    }
    return state;
  }

  function ids(state: Array<number> = [], action: any) {
    if (action.payload && action.payload.entities && action.payload.entities[key]) {
      return union(state, action.payload.result);
    }
    return state;
  }

  function fetching(state: boolean = false, action: any) {
    switch (action.type) {
      case fetchType:
        return true;
      case fetchSuccessType:
      case fetchFailureType:
        return false;
      default:
        return state;
    }
  }

  return {
    byId,
    ids,
    fetching
  };
}
