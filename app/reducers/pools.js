// @flow
import { Event } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { normalize } from 'normalizr';
import { eventSchema } from 'app/reducers';
import { union } from 'lodash';
import mergeObjects from 'app/utils/mergeObjects';
import produce from 'immer';

type State = any;

export default createEntityReducer({
  key: 'pools',
  types: {},
  mutate: produce(
    (newState: State, action: any): void => {
      switch (action.type) {
        case Event.SOCKET_EVENT_UPDATED: {
          const pools =
            normalize(action.payload, eventSchema).entities.pools || {};
          newState.byId = mergeObjects(newState.byId, pools);
          newState.items = union(
            newState.items,
            Object.keys(pools).map(Number)
          );
          break;
        }

        case Event.SOCKET_REGISTRATION.SUCCESS: {
          const poolId = action.payload.pool;
          const statePool = newState.byId[poolId];
          if (!poolId || !statePool) {
            return;
          }
          if (statePool.registrations) {
            statePool.registrations.push(action.payload.id);
          }
          statePool.registrationCount++;
          break;
        }

        case Event.SOCKET_UNREGISTRATION.SUCCESS: {
          const {
            meta: { fromPool },
            payload
          } = action;
          const statePool = newState.byId[fromPool];
          if (!fromPool || !statePool) {
            return;
          }
          if (statePool.registrations) {
            statePool.registrations = statePool.registrations.filter(
              reg => reg !== payload.id
            );
          }
          statePool.registrationCount--;
          break;
        }
      }
    }
  )
});
