import { produce } from 'immer';
import { Routing } from 'app/actions/ActionTypes';

export interface RoutingState {
  statusCode?: number | null;
}

const initialState: RoutingState = {
  statusCode: null,
};

const routing = produce((newState, action) => {
  switch (action.type) {
    case Routing.SET_STATUS_CODE:
      newState.statusCode = action.payload;
      break;

    default:
      break;
  }
}, initialState);

export default routing;
