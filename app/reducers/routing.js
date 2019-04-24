// @flow
import { Routing } from 'app/actions/ActionTypes';
import produce from 'immer';

const initialState = {
  statusCode: null
};

type State = typeof initialState;

const routing = produce((newState: State, action: any): void => {
  switch (action.type) {
    case Routing.SET_STATUS_CODE:
      newState.statusCode = action.payload;
  }
}, initialState);

export default routing;
