import { Event } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { normalize } from 'normalizr';
import { eventSchema } from 'app/reducers';
import { union } from 'lodash';
import mergeObjects from 'app/utils/mergeObjects';

export default createEntityReducer({
  key: 'pools',
  types: {},
  mutate(state, action) {
    switch (action.type) {
      case Event.SOCKET_EVENT_UPDATED: {
        const pools =
          normalize(action.payload, eventSchema).entities.pools || {};
        return {
          ...state,
          byId: mergeObjects(state.byId, pools),
          items: union(state.items, Object.keys(pools).map(Number))
        };
      }
      case Event.SOCKET_REGISTRATION.SUCCESS: {
        const poolId = action.payload.pool;
        const statePool = state.byId[poolId];
        if (!poolId || !statePool) {
          return state;
        }
        return {
          ...state,
          byId: {
            ...state.byId,
            [poolId]: {
              ...statePool,
              ...(statePool.registrations && {
                registrations: [...statePool.registrations, action.payload.id]
              }),
              registrationCount: statePool.registrationCount + 1
            }
          }
        };
      }
      case Event.SOCKET_UNREGISTRATION.SUCCESS: {
        const {
          meta: { fromPool },
          payload
        } = action;
        const statePool = state.byId[fromPool];
        if (!fromPool || !statePool) {
          return state;
        }
        return {
          ...state,
          byId: {
            ...state.byId,
            [fromPool]: {
              ...statePool,
              ...(statePool.registrations && {
                registrations: statePool.registrations.filter(
                  reg => reg !== payload.id
                )
              }),
              registrationCount: statePool.registrationCount - 1
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
