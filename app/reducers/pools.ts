import { createSlice } from '@reduxjs/toolkit';
import { without } from 'lodash';
import { normalize } from 'normalizr';
import { eventSchema } from 'app/reducers';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Event } from '../actions/ActionTypes';
import type { AnyAction } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type { AuthPool } from 'app/store/models/Pool';

const legoAdapter = createLegoAdapter(EntityType.Pools);

const poolsSlice = createSlice({
  name: EntityType.Pools,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    extraCases: (addCase) => {
      addCase(Event.SOCKET_EVENT_UPDATED, (state, action: AnyAction) => {
        const pools =
          normalize(action.payload, eventSchema).entities.pools || {};
        legoAdapter.upsertMany(state, pools);
      });
      addCase(Event.SOCKET_REGISTRATION.SUCCESS, (state, action: AnyAction) => {
        const poolId = action.payload.pool;
        const statePool = state.entities[poolId] as AuthPool;

        if (!poolId || !statePool) {
          return;
        }

        if (statePool.registrations) {
          statePool.registrations.push(action.payload.id);
        }

        statePool.registrationCount++;
      });
      addCase(
        Event.SOCKET_UNREGISTRATION.SUCCESS,
        (state, action: AnyAction) => {
          const {
            meta: { fromPool },
            payload,
          } = action;
          const statePool = state.entities[fromPool] as AuthPool;

          if (!fromPool || !statePool) {
            return;
          }

          if (statePool.registrations) {
            statePool.registrations = without(
              statePool.registrations,
              payload.id,
            );
          }

          statePool.registrationCount--;
        },
      );
    },
  }),
});

export default poolsSlice.reducer;

export const { selectEntities: selectPoolEntities } = legoAdapter.getSelectors(
  (state: RootState) => state.pools,
);
