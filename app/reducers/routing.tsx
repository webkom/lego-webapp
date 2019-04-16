import { Routing } from 'app/actions/ActionTypes';

const initialState = {
  statusCode: null
};

export default function routing(state = initialState, action) {
  switch (action.type) {
    case Routing.SET_STATUS_CODE: {
      return {
        ...state,
        statusCode: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
