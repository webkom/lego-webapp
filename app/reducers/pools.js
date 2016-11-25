import { Event } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export default createEntityReducer({
  key: 'pools',
  types: {
    fetch: false,
    mutate: Event.SOCKET_REGISTRATION
  },
  mutate(state, action) {
    switch (action.type) {
      case Event.SOCKET_REGISTRATION: {
        const registration = action.payload;
        if (!registration.pool) {
          return state;
        }
        return {
          ...state,
          byId: {
            ...state.byId,
            [registration.pool]: {
              ...state.byId[registration.pool],
              registrations: [
                ...state.byId[registration.pool].registrations,
                registration.id
              ]
            }
          }
        };
      }
      case Event.SOCKET_UNREGISTRATION: {
        const registration = action.payload;
        if (!registration.from_pool) {
          return state;
        }
        const registrations = state.byId[registration.from_pool].registrations.filter((reg) => (
          reg !== registration.id
        ));
        return {
          ...state,
          byId: {
            ...state.byId,
            [registration.from_pool]: {
              ...state.byId[registration.from_pool],
              registrations
            }
          }
        };
      }
      default:
        return state;
    }
  }
});
