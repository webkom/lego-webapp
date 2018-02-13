// @flow

import { reducer as formReducer } from 'redux-form';
import { Event } from '../actions/ActionTypes';

export default formReducer.plugin({
  joinEvent: (state, action) => {
    switch (action.type) {
      case Event.REQUEST_REGISTER.BEGIN:
      case Event.REQUEST_UNREGISTER.BEGIN: {
        return {
          ...state,
          userId: action.meta.userId,
          submitting: true
        };
      }
      case Event.REQUEST_REGISTER.FAILURE:
      case Event.REQUEST_UNREGISTER.FAILURE: {
        return {
          ...state,
          submitting: false,
          submitSucceeded: false
        };
      }
      case Event.SOCKET_UNREGISTRATION.SUCCESS:
      case Event.SOCKET_REGISTRATION.SUCCESS: {
        if (!state) return;
        if (action.payload.user.id !== state.userId) {
          return state;
        }
        return {
          ...state,
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
