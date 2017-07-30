import { Event } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { normalize } from 'normalizr';
import { eventSchema } from 'app/reducers';

export default createEntityReducer({
  key: 'pools',
  types: {
    fetch: false
  },
  mutate(state, action) {
    switch (action.type) {
      case Event.SOCKET_EVENT_UPDATED: {
        const pools =
          normalize(action.payload, eventSchema).entities.pools || {};
        return {
          ...state,
          byId: pools,
          items: Object.keys(pools).map(Number)
        };
      }
      case Event.SOCKET_REGISTRATION.SUCCESS: {
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
      case Event.SOCKET_UNREGISTRATION.SUCCESS: {
        const { meta: { fromPool }, payload } = action;
        const pool = state.byId[fromPool];
        if (!fromPool || !pool) {
          return state;
        }
        return {
          ...state,
          byId: {
            ...state.byId,
            [fromPool]: {
              ...pool,
              registrations: pool.registrations.filter(
                reg => reg !== payload.id
              )
            }
          }
        };
      }
      default: {
        return state;
      }
    }
  }
});
