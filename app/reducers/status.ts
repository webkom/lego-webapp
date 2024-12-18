import { createSlice } from '@reduxjs/toolkit';
import { SystemStatus as SystemStatusActions } from 'app/actions/ActionTypes';
import { fetchSystemStatus } from 'app/actions/StatusActions';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import type { SystemStatus } from 'app/actions/StatusActions';
import type { RootState } from 'app/store/createRootReducer';

type ExtraStatusState = {
  systemStatus: SystemStatus | null;
};

const legoAdapter = createLegoAdapter(EntityType.SystemStatus);

const statusSlice = createSlice({
  name: EntityType.SystemStatus,
  initialState: legoAdapter.getInitialState({
    systemStatus: null,
  } as ExtraStatusState),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [SystemStatusActions.FETCH],
    extraCases: (addCase) => {
      addCase(fetchSystemStatus.fulfilled, (state, action) => {
        state.systemStatus = action.payload;
      });
    },
  }),
});

export default statusSlice.reducer;

export const selectSystemStatus = (state: RootState) =>
  state.status.systemStatus;
