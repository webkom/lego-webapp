// @flow

import { reducer as formReducer } from 'redux-form';
import { Event } from '../actions/ActionTypes';

export default formReducer.plugin({
  joinEvent: (state, action) => {
    switch (action.type) {
      case Event.REGISTER.BEGIN:
      case Event.UNREGISTER.BEGIN: {
        return {
          ...state,
          registrationId: null,
          submitting: true
        };
      }
      case Event.REGISTER.SUCCESS:
      case Event.UNREGISTER.SUCCESS:
        return {
          ...state,
          registrationId: action.payload.id
        };
      case Event.SOCKET_UNREGISTRATION.SUCCESS:
      case Event.SOCKET_REGISTRATION.SUCCESS: {
        if (!state) return;
        if (action.payload.id !== state.registrationId) {
          return state;
        }
        return {
          ...state,
          registrationId: null,
          submitting: false,
          submitSucceeded: true
        };
      }
      case Event.SOCKET_REGISTRATION.FAILURE:
      case Event.SOCKET_UNREGISTRATION.FAILURE: {
        if (!state) return;
        if (action.payload.id !== state.registrationId) {
          return state;
        }
        return {
          ...state,
          registrationId: null,
          submitting: false,
          submitSucceeded: false
        };
      }
      default:
        return state;
    }
  }
});
