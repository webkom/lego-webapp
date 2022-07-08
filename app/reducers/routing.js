// @flow
import { produce } from 'immer';

import { Routing } from 'app/actions/ActionTypes';

const initialState = {
  statusCode: null,
};

type State = typeof initialState;

const routing = produce<State>((newState: State, action: any): void => {
  switch (action.type) {
    case Routing.SET_STATUS_CODE:
      newState.statusCode = action.payload;
      break;
    default:
      break;
  }
}, initialState);

export default routing;
