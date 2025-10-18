import { createSlice } from '@reduxjs/toolkit';
import { fetchSystemStatus } from '~/redux/actions/StatusActions';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import type { SystemStatus } from '~/redux/models/Status';
import type { RootState } from '~/redux/rootReducer';

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
