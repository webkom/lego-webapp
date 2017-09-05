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
    case '@@router/LOCATION_CHANGE': {
      console.log('asd', state.locationBeforeTransitions, action.payload);
      const { locationBeforeTransitions } = state;
      if (
        locationBeforeTransitions &&
        (locationBeforeTransitions.pathname !== action.payload.pathname ||
          locationBeforeTransitions.key !== action.payload.key)
      ) {
        return {
          ...state,
          statusCode: null
        };
      }
      return state;
    }
    default: {
      return state;
    }
  }
}
